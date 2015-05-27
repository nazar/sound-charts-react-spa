import _ from 'lodash';
import Reflux from 'reflux';

import tracksStore from 'stores/tracksStore';

import trackActions from 'actions/trackActions';

let currentTrackIdx = -1;
let playing = false;

let playerStore = Reflux.createStore( {

    init() {
        //listen to tracks store
        this.listenTo( tracksStore, tracksChanged.bind( this ) );

        //playerActions listeners - these listen to track player actions
        this.listenTo( trackActions.start, trackStartPlay.bind( this ) );
        this.listenTo( trackActions.finished, trackPlayNext.bind( this ) );
        this.listenTo( trackActions.stop, trackStopPlay.bind( this ) );
        this.listenTo( trackActions.next, trackPlayNext.bind( this ) );
        this.listenTo( trackActions.previous, trackPlayPrevious.bind( this ) );
        this.listenTo( trackActions.togglePlay, trackPlayToggle.bind( this ) );
        this.listenTo( trackActions.setToCurrentIndex, setToCurrentIndex.bind( this ) );

    },

    getData() {
        return {
            currentTrackIdx,
            playing,
            track: trackFromCurrentTrackIdx.call( this ),
            isFirst: trackIsFirst.call( this ),
            isLast: trackIsLast.call( this )
        };
    }

} );

export default playerStore;

//////////////////
///// PRIVATE
//////////////////

function tracksChanged() {
    playing = false;
    currentTrackIdx = 0;

    this.trigger( this.getData() );
}

function trackStartPlay() {
    playing = true;

    this.trigger( this.getData() );
}

function trackStopPlay() {
    playing = false;

    this.trigger( this.getData() );
}

function trackPlayNext() {
    setCurrentToNext.call( this );
    playing = true;

    this.trigger( this.getData() );
}

function trackPlayPrevious() {
    setCurrentToPrevious.call( this );
    playing = true;

    this.trigger( this.getData() );
}

function trackPlayToggle( track ) {
    let trackIdx = _.findIndex( tracksStore.tracks(), t =>  t.id === track.id );

    if ( trackIdx !== currentTrackIdx ) {
        currentTrackIdx = trackIdx;
        playing = true;
    } else {
        playing = !playing;
    }

    this.trigger( this.getData() );
}

function setCurrentTrack( trackIdx ) {
    currentTrackIdx = trackIdx;
    playing = false;
}

function setCurrentToNext() {
    if ( tracksStore.tracksLength() ) {
        if ( (currentTrackIdx !== -1) && (currentTrackIdx < tracksStore.tracksLength()) ) {
            setCurrentTrack( currentTrackIdx + 1 );
        } else {
            setCurrentTrack( 0 );
        }
    } else {
        setCurrentTrack( -1 );
    }
}

function setCurrentToPrevious() {
    if ( tracksStore.tracksLength() ) {
        if ( (currentTrackIdx !== -1) && (currentTrackIdx > 0) ) {
            setCurrentTrack( currentTrackIdx - 1 );
        } else {
            setCurrentTrack( 0 );
        }
    } else {
        setCurrentTrack( -1 );
    }
}

function setToCurrentIndex( trackIdx ) {
    if ( currentTrackIdx !== trackIdx ) {
        currentTrackIdx = trackIdx;

        this.trigger( this.getData() );
    }
}

function trackFromCurrentTrackIdx() {
    if ( currentTrackIdx !== -1 ) {
        return tracksStore.getTrackByIndex( currentTrackIdx );
    }
}

function trackIsFirst() {
    return tracksStore.tracksLength() && (currentTrackIdx === 0);
}

function trackIsLast() {
    return tracksStore.tracksLength() && (currentTrackIdx >= (  tracksStore.tracksLength() - 1));
}
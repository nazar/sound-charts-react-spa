import React from 'react';
import cx from 'classnames';

import trackActions from 'actions/trackActions';

export default React.createClass( {

    toggleTrackPlay() {
        trackActions.togglePlay( this.props.track );
    },

    componentDidUpdate( prevProps ) {
        let $this = $( this.getDOMNode() );

        //focus in view if this thumbnail just started playing
        if ( !(prevProps.playing) && this.props.playing && !( $this.visible() ) ) {
            $.scrollTo( $this, {
                duration: 250,
                offset: -100
            } );
        }
    },

    render() {
        let track;
        let playerControl;
        let thumbnailClasses;

        track = this.props.track;

        if ( this.props.playing ) {
            playerControl = <i className="fa player-control fa-stack-1x fa-stop fa-inverse"></i>;
        } else {
            playerControl = <i className="fa player-control fa-stack-1x fa-play fa-inverse"></i>;
        }

        thumbnailClasses = cx(
            'track-thumbnail',
            'col-xs-6 col-sm-4 col-md-2 col-lg-2',
            {
                active: this.props.active
            }
        );

        return (
            <div className={thumbnailClasses}
                 onClick={this.toggleTrackPlay}
                >
                    <div className="rank">
                    { track.rank_playback_count }
                </div>

                <div className="stats">
                    {trackIconClass.call( this )} {trackPlaybackDelta.call( this )}
                </div>

                <div className="thumbnail">
                    {track.image_url && <img data-layzr={track.image_url} src={require('assets/img/loading-album.jpg')} alt=""/>}
                    {!track.image_url && <img src={require('assets/img/no-image.jpg')}/>}
                </div>

                <div className="play-indicator">
                    <span className="fa-stack fa-lg">
                        <i className="fa fa-circle fa-stack-1x"></i>
                        { playerControl }
                    </span>
                </div>

                <div className="track-title" data-toggle="tooltip" data-placement="top" title={ track.name }>
                    { track.name }
                </div>
            </div>
        );
    }

} );

////////////////////////////
/// Private

function trackIconClass() {
    let track = this.props.track;
    let icon;

    if ( track.last_rank_playback_count ) {
        if ( track.rank_playback_count < track.last_rank_playback_count ) {
            icon =  'fa-arrow-up';
        } else if ( track.rank_playback_count > track.last_rank_playback_count ) {
            icon =  'fa-arrow-down';
        } else {
            icon = 'fa-arrows-h';
        }
    } else {
        icon = 'fa-star';
    }

    return <i className={cx( 'fa', icon )}></i>;
}

function trackPlaybackDelta() {
    let track = this.props.track;

    if ( track.last_rank_playback_count ) {
        return Math.abs( ( track.last_rank_playback_count || 99 ) - track.rank_playback_count ) || '';
    }
}

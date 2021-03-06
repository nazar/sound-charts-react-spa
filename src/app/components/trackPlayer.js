import React from 'react';
import Reflux from 'reflux';
import cx from 'classnames';
import {Navigation} from 'react-router';

import playerStore from 'stores/playerStore';
import trackActions from 'actions/trackActions';

import SoundCloudPlayer from 'components/soundCloudPlayer';

export default React.createClass( {
    mixins: [
        Navigation,
        Reflux.listenTo( playerStore, 'onPlayerStoreChanged' )
    ],

    getInitialState() {
        return {
            currentTrack: playerStore.getData(),
            state: 'min'
        };
    },

    onPlayerStoreChanged( playerData ) {
        this.setState( {
            currentTrack: playerData
        } );
    },

    onStartedPlay() {
        trackActions.start();
    },

    onEndedPlay() {
        trackActions.finished();
    },

    onPausedPlay() {
        trackActions.stop();
    },

    previousTrack() {
        trackActions.previous();
    },

    nextTrack() {
        trackActions.next();
    },

    render() {
        let currentTrack = this.state.currentTrack;
        let nextClass = cx( 'fa fa-step-forward', {
            disabled: currentTrack && currentTrack.isLast
        } );
        let prevClass = cx( 'fa fa-step-backward', {
            disabled: currentTrack && currentTrack.isFirst
        } );
        let playerClass = cx( 'track-player', {
            max: this.state.state === 'max'
        } );

        return (
            <div className={playerClass}>
                <div className="container">

                    <div className="row">
                        <div className="col-md-11 col-xs-11 soundcloud-frame">
                            {currentTrack.track && <SoundCloudPlayer
                                track={ currentTrack.track }
                                disableLayzr={true}
                                playing={ currentTrack.playing }
                                >
                            </SoundCloudPlayer>}
                        </div>

                        <div className="col-md-1 col-xs-1 player-controls">
                            <div className="control">
                                <i className={nextClass} onClick={ this.nextTrack }></i>
                            </div>

                            <div className="control">
                                <i className={prevClass} onClick={ this.previousTrack }></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

} );
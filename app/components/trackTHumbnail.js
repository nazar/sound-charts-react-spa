import React from 'react';
import ClassNames from 'classnames';

import trackActions from 'actions/trackActions';

var TrackThumbnail = React.createClass( {

    toggleTrackPlay( e ) {
        trackActions.togglePlay( this.props.track );
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

        thumbnailClasses = ClassNames(
            'thumbnail-container',
            {
                active: this.props.active
            }
        );

        return (
            <div className="track-thumbnail">


                <div className={thumbnailClasses}
                     onClick={this.toggleTrackPlay}
                    >
                    <div className="rank">
                        { track.rank_playback_count }
                    </div>

                    <div className="thumbnail">
                        <img src={track.image_url} alt=""/>
                    </div>

                    <div className="play-indicator">
                        <span className="fa-stack fa-lg">
                            <i className="fa fa-circle fa-stack-1x"></i>
                            { playerControl }
                        </span>
                    </div>
                </div>

                <div className="track-title" title={ track.name }>
                    { track.name }
                </div>

            </div>
        );
    }

} );

export default TrackThumbnail;
import Head from 'next/head'
import { useRouter } from 'next/router';
import Script from 'next/script'

import { useRef, useState } from 'react'
import ReactPlayer from 'react-player'


function Play(){
    const router = useRouter();
    const movie = JSON.parse(router.query.data);

    // const vidRef = useRef(null);
    // const handlePlayVideo = () => {
    //     const video = vidRef.current;
    //     if(video.paused){
    //         video.play();
    //     }else{
    //         video.pause();
    //     }
      
    // }

    //     <video className="player" controls ref={vidRef}>
    //         <source src={`/movies/${movie.movieFolder}/${movie.filePath}`}/>
    //     </video>
    //     <div className="controls">
    //         <button onClick={handlePlayVideo}>playy</button>
    //     </div>

    return(
        <div>
            <Script src="../scripts/vendor/VideoSub/videosub.js" />
            
            <div className="playDiv">

                <ReactPlayer 
                url={`/movies/${movie.movieFolder}/${movie.filePath}`}
                controls={true}
                config={{ file: {
                    tracks: movie.subtitles.map((subtitle)=> (
                        {kind: 'subtitles', src: '/movies/' + movie.movieFolder + '/' + subtitle.filepath, srcLang: subtitle.language}
                    ))
                }}}
                />
            </div>
        </div>

    )
}

export default Play;

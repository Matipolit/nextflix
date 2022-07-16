import { useRouter } from 'next/router';
import { useRef, useState } from 'react'

function Play(){
    const router = useRouter();
    const movie = JSON.parse(router.query.data);

    const vidRef = useRef(null);
    const handlePlayVideo = () => {
        const video = vidRef.current;
        if(video.paused){
            video.play();
        }else{
            video.pause();
        }
      
    }

    return(
        <div className="playDiv">
            <video className="player" controls ref={vidRef}>
                <source src={`/movies/${movie.movieFolder}/${movie.filePath}`}/>
            </video>
            <div className="controls">
                <button onClick={handlePlayVideo}>playy</button>
            </div>
        </div>
    )
}

export default Play;

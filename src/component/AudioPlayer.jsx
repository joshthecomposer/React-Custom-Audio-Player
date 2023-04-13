import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import axios from 'axios'
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import {BsFillSkipEndFill, BsFillSkipStartFill} from 'react-icons/bs'
import AudioContainerSm from './AudioContainerSm'

const AudioPlayer = (props) => {
    const { audioObjectArray, currentPlayState, setCurrentPlayState, img, setImg, masterAudio, dangerousHTML, setDangerousHTML } = props;

    const canvasRef = useRef() //TODO: Make this be the canvas that is in the audioplayer component

    // const drawAudioVisualiser = () => {

    //     masterAudioSource.current = masterAudio.current;
    //     masterAnalyser.current = masterAudioSource.createAnalyser();

    //     masterAnalyser.fftSize = 1024;

    //     let bufferLength = masterAnalyser.frequencyBinCount;
    //     let dataArray = new Uint8Array(bufferLength);

    //     let WIDTH = masterCanvas.width;
    //     let HEIGHT = masterCanvas.height;

    //     let barWidth = (WIDTH / bufferLength) * 1;
    //     let barHeight;
    //     let x = 0;

    //     const renderFrame = () => {
    //         requestAnimationFrame(renderFrame)

    //         x = 0;

    //         masterAnalyser.getByteFrequencyData(dataArray);
    //         masterAudioContext.clearRect(0, 0, WIDTH, HEIGHT);

    //         for (let i = 0; i < bufferLength; i++) {
    //             barHeight = dataArray[i] / 2;

    //             let r = 255;
    //             let g = 255;
    //             let b = 255;

    //             masterAudioContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    //             masterAudioContext.fillRect(x, HEIGHT - barHeight, barWidth * 3, barHeight)

    //             x += barWidth + 1;
    //         }
    //     }
    //     renderFrame();
    // }

    //This allows the user to play/pause and select other tracks within the tracklist
    const handleGranularPlayback = (index, oneAudio) => { //TODO: REFACTOR THIS FUNCTION.
        if (currentPlayState.isPlaying) {
            if (currentPlayState.idx === index) {
                masterAudio.current.pause();
                setCurrentPlayState({ ...currentPlayState, isPlaying: false });
            } else {
                masterAudio.current.pause();
                masterAudio.current = new Audio(oneAudio.links[0].href);
                setCurrentPlayState({ ...currentPlayState, idx: index, summaryIdx:index });
                masterAudio.current.play();
            }
        } else {
            if (currentPlayState.idx === index) {
                setCurrentPlayState({ ...currentPlayState, isPlaying: true });
                masterAudio.current.play();
            } else {
                masterAudio.current.pause();
                masterAudio.current = new Audio(oneAudio.links[0].href);
                setCurrentPlayState({ ...currentPlayState, idx: index, isPlaying: true, summaryIdx:index });
                masterAudio.current.play();
            }
        }
        if (!currentPlayState.isInit) {
            masterAudio.current.pause();
            masterAudio.current = new Audio(oneAudio.links[0].href);
            setCurrentPlayState({ ...currentPlayState,isPlaying:true, isInit: true, idx:index, summaryIdx:index });
            masterAudio.current.play();
        }
    }
    //TODO: REFACTOR BOTH PLAYBACK FUNCTIONS TO BE MORE CONCISE AND HANDLE EVERYTING IN ONE FUNCTION.
    const handleMasterPlayback = () => {
        if (!currentPlayState.isInit) {
            setCurrentPlayState({ ...currentPlayState, idx: 0, isInit: true, isPlaying:true });
            masterAudio.current = new Audio(audioObjectArray[0].links[0].href) //TODO: Check if this can ref oneAudio
            masterAudio.current.play();
        } else {
            if (currentPlayState.isPlaying) {
                masterAudio.current.pause();
                setCurrentPlayState({...currentPlayState, isPlaying:false})
            } else {
                masterAudio.current.play();
                setCurrentPlayState({...currentPlayState, isPlaying:true})
            }
        }
    }

    const handleSkip = (input) => {
        if (!currentPlayState.isInit) {
            handleMasterPlayback();
            return;
        }
        if ((currentPlayState.idx + input) > (audioObjectArray.length - 1)) {
            masterAudio.current.pause();
            setCurrentPlayState({ ...currentPlayState, idx: 0, isPlaying: true })
            masterAudio.current = new Audio(audioObjectArray[0].links[0].href)
            masterAudio.current.play();
            return;
        } else if ((currentPlayState.idx + input) < 0) {
            masterAudio.current.pause();
            setCurrentPlayState({ ...currentPlayState, idx: audioObjectArray.length-1, isPlaying: true })
            masterAudio.current = new Audio(audioObjectArray[audioObjectArray.length-1].links[0].href)
            masterAudio.current.play();
            return
        }
        masterAudio.current.pause();
        setCurrentPlayState({ ...currentPlayState, idx: currentPlayState.idx + input, isPlaying: true });
        masterAudio.current = new Audio(audioObjectArray[currentPlayState.idx+input].links[0].href)
        masterAudio.current.play();
    }

    // const handleVisualiser = () => {
    //     masterAudio.current.crossOrigin = "anonymous"
    //     console.log("We made it into HandleVisualiser function.")
    //     const audioContext = new AudioContext();
    //     const source = audioContext.createMediaElementSource(masterAudio.current);
    //     const analyser = audioContext.createAnalyser();
    //     source.connect(analyser);
    //     analyser.connect(audioContext.destination);

    //     const canvas = canvasRef.current;

    //     const draw = () => {
    //         const dataArray = new Uint8Array(analyser.frequencyBinCount);
    //         analyser.getByteFrequencyData(dataArray);
            
    //         const canvas = canvasRef.current;
    //         const ctx = canvas.getContext('2d');
            
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         ctx.fillStyle = 'rgb(255, 255, 255)';
    //         ctx.fillRect(0, 0, canvas.width, canvas.height);
            
    //         const barWidth = (canvas.width / dataArray.length) * 2.5;
    //         let x = 0;

    //         for (let i = 0; i < dataArray.length; i++) {
    //           const barHeight = (dataArray[i] / 255) * canvas.height * 0.5;
    //           ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
    //           ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    //           x += barWidth + 1;
    //         }
            
    //         requestAnimationFrame(draw);
    //     };
    // };

    // useEffect(() => {
    //     if (masterAudio.current) {
    //         const audio = masterAudio.current;
    //         audio.addEventListener('play', () => {
    //             console.log("audio is playing...")
    //         })
    //     }
    // },[masterAudio])

    return (
        <div className='flex items-center flex-col w-full xl:w-1/2 md:w-2/3 bg-mines-900 relative rounded-lg overflow-hidden shadow-lg'>
            <div className='flex w-full h-[250px] relative'>
                <img src={img} className='w-[250px]' alt="" />
                <div className="flex flex-col w-full">
                    <div className="w-full h-1/2">
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>
                    <div className="w-full h-1/2 flex justify-center items-center gap-10 py-">
                        <BsFillSkipStartFill
                            className="text-neutral-200 hover:cursor-pointer hover:text-white"
                            onClick={() => handleSkip(-1)}
                            size="50px" />
                        {
                            currentPlayState.isPlaying ?
                                <FaPauseCircle
                                    onClick={handleMasterPlayback}
                                    size="100px"
                                    className='text-neutral-200 hover:cursor-pointer hover:text-white' />
                                :
                                <FaPlayCircle
                                    onClick={handleMasterPlayback}
                                    size="100px"
                                    className="text-neutral-200 hover:cursor-pointer hover:text-white" />
                        }
                        <BsFillSkipEndFill
                            className="text-neutral-200 hover:cursor-pointer hover:text-white"
                            onClick={() => handleSkip(1)}
                            size="50px" />
                    </div>
                </div>
            </div>
            <div
                className='flex flex-col w-full'
                style={{flexDirection:currentPlayState.isSummaryShowing ? "row" : "column"}}>
                    <div
                    dangerouslySetInnerHTML={currentPlayState.isSummaryShowing ? dangerousHTML : null}
                    className="px-20 py-20 w-full top-0 tracking-normal text-2xl max-h-[50rem] overflow-x-hidden"
                    style={{width:currentPlayState.isSummaryShowing ? "50%" : "100%", display: currentPlayState.isSummaryShowing ? "block" : "none"}}>
                    </div>
                <div
                    className="w-full flex flex-col bg-mines-900 overflow-x-hidden overflow-y-scroll max-h-[50rem]"
                    style={{width:currentPlayState.isSummaryShowing ? "50%" : "100%"}}>
                    {
                        audioObjectArray.map((a, i) => (
                            <div key={i}>
                                <AudioContainerSm setImg={setImg} handleGranularPlayback={handleGranularPlayback} masterAudio={masterAudio} oneAudioFromArray={a} idx={i} currentPlayState={currentPlayState} setCurrentPlayState={setCurrentPlayState} setDangerousHTML={setDangerousHTML} audioObjectArray={ audioObjectArray } handleVisualiser={handleVisualiser} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer
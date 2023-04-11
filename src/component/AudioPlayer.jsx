import React, { useState, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'
import AudioContainerSm from './AudioContainerSm'

const AudioPlayer = (props) => {
    const { audioObjectArray, currentPlayState, setCurrentPlayState, img, setImg, masterAudio, dangerousHTML, setDangerousHTML } = props;

    const handleGranularPlayback = (index, oneAudio) => {
        if (currentPlayState.isPlaying) {
            console.log(currentPlayState);
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

    return (
        <div className='flex items-center flex-col w-full md:w-1/2 bg-mines-900 relative z-'>
            <div className='flex w-full h-[250px] relative'>
                <img src={img} className='w-[250px] rounded-lg' alt="" />
            </div>
                <div
                dangerouslySetInnerHTML={currentPlayState.isSummaryShowing ? dangerousHTML : null}
                className="bg-neutral-500 px-20 py-20 w-full top-0 tracking-normal"
                style={{display: currentPlayState.isSummaryShowing ? 'block' : 'none'}}>
                </div>
            <div className="w-full flex flex-col bg-mines-900 max-h-[50rem] overflow-x-hidden overflow-y-scroll">
                {
                    audioObjectArray.map((a, i) => (
                        <div key={i}>
                            <AudioContainerSm setImg={setImg} handleGranularPlayback={handleGranularPlayback} masterAudio={masterAudio} oneAudioFromArray={a} idx={i} currentPlayState={currentPlayState} setCurrentPlayState={setCurrentPlayState} setDangerousHTML={setDangerousHTML} audioObjectArray={ audioObjectArray } />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AudioPlayer
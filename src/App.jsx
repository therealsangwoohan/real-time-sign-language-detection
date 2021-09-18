import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import helloImg from './images/hello.jpg';
import iloveyouImg from './images/iloveyou.jpg';
import noImg from './images/no.png';
import thankyouImg from './images/thankyou.png';
import yesImg from './images/yes.jpg';

export default function App() {
  const webcamRef = useRef(null);
  const signLabelRef = useRef('');
  const scoreRef = useRef(0);

  async function detect(net) {
    if (webcamRef.current.video.readyState !== 4) {
      return;
    }

    // Get input.
    const { video } = webcamRef.current;
    const { videoWidth, videoHeight } = video;
    const img = tf.browser.fromPixels(video);
    const resized = tf.image.resizeBilinear(img, [videoWidth, videoHeight]);
    const casted = resized.cast('int32');
    const expanded = casted.expandDims(0);

    // Run the input through the net.
    const obj = await net.executeAsync(expanded);

    // Draw the results.
    const classes = (await obj[2].array())[0];
    const scores = (await obj[4].array())[0];

    const labelMap = {
      1: 'Hello',
      2: 'Thank You',
      3: 'I Love You',
      4: 'Yes',
      5: 'No',
    };
    for (let i = 0; i < classes.length; i += 1) {
      if (scores[i] > 0.8) {
        signLabelRef.current.innerText = `Translates to: ${labelMap[classes[i]]}`;
        scoreRef.current.innerText = `Accuracy score: ${scores[i]}`;
      }
    }

    // Clean memory.
    tf.dispose(obj);
    tf.dispose(img);
    tf.dispose(resized);
    tf.dispose(casted);
    tf.dispose(expanded);
  }

  useEffect(async () => {
    const modelURL = 'https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json';
    const net = await tf.loadGraphModel(modelURL);
    setInterval(() => {
      detect(net);
    }, 16.7);
  });

  return (
    <div className="App">
      <div className="header">
        <div className="translation" ref={signLabelRef}>Translates to: N/A</div>
        <div className="score" ref={scoreRef}>Accuracy Score: N/A</div>
      </div>
      <Webcam
        ref={webcamRef}
        muted
        style={{
          width: 640,
          height: 480,
        }}
      />
      <div className="guide">
        <div className="sign-language">
          <div className="sign-language name">Hello</div>
          <img src={helloImg} alt="" className="sign-language image" />
        </div>
        <div className="sign-language">
          <div className="sign-language name">Thank You</div>
          <img src={thankyouImg} alt="" className="sign-language image" />
        </div>
        <div className="sign-language">
          <div className="sign-language name">I Love You</div>
          <img src={iloveyouImg} alt="" className="sign-language image" />
        </div>
        <div className="sign-language">
          <div className="sign-language name">Yes</div>
          <img src={yesImg} alt="" className="sign-language image" />
        </div>
        <div className="sign-language">
          <div className="sign-language name">No</div>
          <img src={noImg} alt="" className="sign-language image" />
        </div>
      </div>
    </div>
  );
}

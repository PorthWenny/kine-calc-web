import React, {useState, useEffect} from 'react'
import "./styles.css"

function App() {
  const [userInputs, setUserInputs] = useState({
    displacement: '',
    init_velocity: '',
    fin_velocity: '',
    acceleration: '',
    time: ''
  });
  
  const [calculatedValues, setCalculatedValues] = useState({
    displacement: '',
    init_velocity: '',
    fin_velocity: '',
    acceleration: '',
    time: ''
  });

  const [selectedTimeMod, setSelectedTimeMod] = useState('');
  let timeMod = 1;

  const handleSelectTimeMod = (event) => {
    setSelectedTimeMod(event.target.value);
  
    if (event.target.value === 'mins') {
      timeMod = 1;
    }
  }

  const [selectedDisplacementMod, setSelectedDisplacementMod] = useState('');
  let displacementMod = 1;

  const handleSelectDisplacementMod = (event) => {
    setSelectedDisplacementMod(event.target.value);
  
    if (event.target.value === 'cm') {
      displacementMod = 60;
    }
  }

  let countNonEmptyInputs = () => {
    let count = 0;
    Object.values(userInputs).forEach(val => {
      if (val !== '') {
        count++;
      }
    });
    return count;
  }

  let calcKine = () => {
    // a = ? and s = ?
    if (userInputs.acceleration === '' && userInputs.displacement === '') {
      const newAcceleration = (userInputs.fin_velocity - userInputs.init_velocity) / userInputs.time;
      setCalculatedValues(prevValues => ({
        ...prevValues,
        acceleration: newAcceleration.toFixed(2),
        displacement: ((userInputs.init_velocity * userInputs.time) + (0.5 * newAcceleration * Math.pow(userInputs.time, 2))).toFixed(2)
      }));
    } 
    // t = ? and s = ?
    else if (userInputs.displacement == '' && userInputs.time == '') {
      const newTime = (userInputs.fin_velocity - userInputs.init_velocity) / userInputs.acceleration;
      setCalculatedValues(prevValues => ({
        ...prevValues,
        time: newTime.toFixed(2),
        displacement: ((userInputs.init_velocity * newTime) + (0.5 * userInputs.acceleration * Math.pow(newTime, 2))).toFixed(2)
      }));
    } 
    // a = ? and t = ?
    else if (userInputs.acceleration == '' && userInputs.time == '') {
      const newAcceleration = (Math.pow(userInputs.fin_velocity, 2) - Math.pow(userInputs.init_velocity, 2)) / (2 * userInputs.displacement);
      setCalculatedValues(prevValues => ({
        ...prevValues,
        acceleration: newAcceleration.toFixed(2),
        time: ((userInputs.fin_velocity - userInputs.init_velocity) / newAcceleration).toFixed(2)
      }));
    }
    // v = ? and s = ?
    else if (userInputs.fin_velocity == '' && userInputs.displacement == '') {
      const newFinVelocity = userInputs.init_velocity + (userInputs.acceleration * userInputs.time);
      setCalculatedValues(prevValues => ({
        ...prevValues,
        fin_velocity: newFinVelocity.toFixed(2),
        displacement: ((userInputs.init_velocity * userInputs.time) + (0.5 * userInputs.acceleration * Math.pow(userInputs.time, 2))).toFixed(2)
      }));
    }
    // u = ? and s = ?
    else if (userInputs.init_velocity == '' && userInputs.displacement == '') {
      const newInitVelocity = userInputs.fin_velocity - (userInputs.acceleration * userInputs.time);
      setCalculatedValues(prevValues => ({
        ...prevValues,
        init_velocity: newInitVelocity.toFixed(2),
        displacement: ((newInitVelocity * userInputs.time) + (0.5 * userInputs.acceleration * Math.pow(userInputs.time, 2))).toFixed(2)
      }));
    }
    // u = ? and v = ?
    else if (userInputs.init_velocity == '' && userInputs.fin_velocity == '') {
      const newInitVelocity = (userInputs.displacement - (0.5 * userInputs.acceleration * Math.pow(userInputs.time, 2))) / userInputs.time;
      setCalculatedValues(prevValues => ({
        ...prevValues,
        init_velocity: newInitVelocity.toFixed(2),
        fin_velocity: (newInitVelocity + (userInputs.acceleration * userInputs.time)).toFixed(2)
      }));
    }
    // 
  }

  /*getInitVelocity = () => {
    if (userInputs.displacement === '') {
      const newInitVelocity = userInputs.fin_velocity - (userInputs.acceleration * userInputs.time);
    } else if (userInputs.fin_velocity === ''){
      const newInitVelocity = (userInputs.displacement - (0.5 * userInputs.acceleration * Math.pow(userInputs.time, 2))) / userInputs.time;
    } else if (userInputs.time === '') {
      const newInitVelocity = Math.sqrt(userInputs.fin_velocity)
    }
  }*/

  useEffect(() => {
    if (countNonEmptyInputs() === 3) {
      calcKine();
    }
  }, [userInputs]);

  let reload = () => {
    window.location.reload()
  }

  const [isContainerFocused, setIsContainerFocused] = useState(false);

  return (
    <>
    <h2 className='header'>kinematics calculator.</h2>
    <div className={`background ${isContainerFocused ? 'blur' : ''}`}></div>
    <div className={`container ${isContainerFocused ? 'focused' : ''}`} 
    tabIndex="0" 
    onFocus={() => setIsContainerFocused(true)} 
    onBlur={() => setIsContainerFocused(false)}>
        <form>
          <label>Displacement</label>
          <div className="input-select-container">
            <input placeholder='0' value={userInputs.displacement || calculatedValues.displacement} onChange={(event) => {setUserInputs(prevInputs => ({...prevInputs, displacement: event.target.value}));}}
            style={{backgroundColor: calculatedValues.displacement ? 'rgb(230, 255, 225)' : 'white'}}/>
            <select value={selectedDisplacementMod} onChange={handleSelectDisplacementMod}>
              <option value="m">m</option>
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="ft">ft</option>
            </select>
          </div>
          <label>Initial Velocity</label>
          <div className="input-select-container">
            <input placeholder='0' value={userInputs.init_velocity || calculatedValues.init_velocity} onChange={(event) => {setUserInputs(prevInputs => ({...prevInputs, init_velocity: event.target.value}));}}
            style={{backgroundColor: calculatedValues.init_velocity ? 'rgb(230, 255, 225)' : 'white'}}/>
          </div>
          <label>Final Velocity</label>
          <div className="input-select-container">
            <input placeholder='0' value={userInputs.fin_velocity || calculatedValues.fin_velocity} onChange={(event) => {setUserInputs(prevInputs => ({...prevInputs, fin_velocity: event.target.value}));}}
            style={{backgroundColor: calculatedValues.fin_velocity ? 'rgb(230, 255, 225)' : 'white'}}/>
          </div>
          <label>Acceleration</label>
          <div className="input-select-container">
            <input placeholder='0' value={userInputs.acceleration || calculatedValues.acceleration} onChange={(event) => {setUserInputs(prevInputs => ({...prevInputs, acceleration: event.target.value}));}}
            style={{backgroundColor: calculatedValues.acceleration ? 'rgb(230, 255, 225)' : 'white'}}/>
          </div>
          <label>Time</label>
          <div className="input-select-container">
            <input placeholder='0' value={userInputs.time || calculatedValues.time} onChange={(event) => {setUserInputs(prevInputs => ({...prevInputs, time: event.target.value}));}}
            style={{backgroundColor: calculatedValues.time ? 'rgb(230, 255, 225)' : 'white'}}/>
            <select value={selectedTimeMod} onChange={handleSelectTimeMod}>
              <option value="seconds">sec.</option>
              <option value="mins">min.</option>
              <option value="hours">hr.</option>
            </select>
          </div>

          <div> 
            <button className='btn' onClick={reload} type='submit'>reset</button>
          </div>
        </form>
      </div>
      <h4 className='credits'>Made by Group 2 <n></n> for Calculus-based Physics Final Project. <n></n> © porth, 2024.</h4>
    </>
  )
}

export default App

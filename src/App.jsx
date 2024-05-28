import React, { useState, useEffect } from "react";
import "./styles.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const mathJaxConfig = {
  options: {
    renderActions: {
      addMenu: [],
    },
  },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
    processEnvironments: true,
    autoload: {
      color: [],
      colorV2: ["color"],
      mhchem: ["mhchem"],
      physics: ["physics"],
    },
    tags: "ams",
    tagSide: "right",
    tagIndent: "0.8em",
    useLabelIds: true,
    multlineWidth: "85%",
    linebreaks: { automatic: true },
  },
  "HTML-CSS": { linebreaks: { automatic: true } },
  SVG: { linebreaks: { automatic: true } },
};

function App() {
  const [userInputs, setUserInputs] = useState({
    displacement: "",
    init_velocity: "",
    fin_velocity: "",
    acceleration: "",
    time: "",
  });

  const [calculatedValues, setCalculatedValues] = useState({
    displacement: "",
    init_velocity: "",
    fin_velocity: "",
    acceleration: "",
    time: "",
  });

  const [selectedTimeMod, setSelectedTimeMod] = useState("seconds");
  const [selectedDisplacementMod, setSelectedDisplacementMod] = useState("m");
  const [selectedAccelerationMod, setSelectedAccelerationMod] =
    useState("m/s²");
  const [selectedInitVelMod, setSelectedInitVelMod] = useState("m/s");
  const [selectedFinVelMod, setSelectedFinVelMod] = useState("m/s");

  const [stepByStep, setStepByStep] = useState("");

  const handleSelectTimeMod = (event) => {
    setSelectedTimeMod(event.target.value);
  };

  const handleSelectDisplacementMod = (event) => {
    setSelectedDisplacementMod(event.target.value);
  };

  const handleSelectAccelerationMod = (event) => {
    setSelectedAccelerationMod(event.target.value);
  };

  const handleSelectInitVelMod = (event) => {
    setSelectedInitVelMod(event.target.value);
  };

  const handleSelectFinVelMod = (event) => {
    setSelectedFinVelMod(event.target.value);
  };

  let convertTime = (time, fromUnit, toUnit) => {
    const timeConversion = {
      seconds: 1,
      mins: 60,
      hours: 3600,
    };
    return (time * timeConversion[fromUnit]) / timeConversion[toUnit];
  };

  let convertDisplacement = (displacement, fromUnit, toUnit) => {
    const displacementConversion = {
      m: 1,
      cm: 0.01,
      km: 1000,
      ft: 0.3048,
    };
    return (
      (displacement * displacementConversion[fromUnit]) /
      displacementConversion[toUnit]
    );
  };

  let convertAcceleration = (acceleration, fromUnit, toUnit) => {
    const accelerationConversion = {
      "m/s²": 1,
      "km/s²": 1000,
      "ft/s²": 0.3048,
    };
    return (
      (acceleration * accelerationConversion[fromUnit]) /
      accelerationConversion[toUnit]
    );
  };

  let convertInitVelocity = (velocity, fromUnit) => {
    const velocityConversion = {
      "m/s": 1,
      "cm/s": 0.01,
      "km/h": 0.277778,
    };
    return velocity * velocityConversion[fromUnit];
  };

  let convertFinVelocity = (velocity, fromUnit) => {
    const velocityConversion = {
      "m/s": 1,
      "cm/s": 0.01,
      "km/h": 0.277778,
    };
    return velocity * velocityConversion[fromUnit];
  };

  let countNonEmptyInputs = () => {
    let count = 0;
    Object.values(userInputs).forEach((val) => {
      if (val !== "") {
        count++;
      }
    });
    return count;
  };

  let calcKine = () => {
    let { displacement, init_velocity, fin_velocity, acceleration, time } =
      userInputs;

    // Convert inputs to SI units for calculation
    if (time) time = convertTime(parseFloat(time), selectedTimeMod, "seconds");
    if (displacement)
      displacement = convertDisplacement(
        parseFloat(displacement),
        selectedDisplacementMod,
        "m"
      );
    if (acceleration)
      acceleration = convertAcceleration(
        parseFloat(acceleration),
        selectedAccelerationMod,
        "m/s²"
      );
    if (init_velocity) {
      init_velocity = convertInitVelocity(
        parseFloat(init_velocity),
        selectedInitVelMod
      );
    }
    if (fin_velocity) {
      fin_velocity = convertFinVelocity(
        parseFloat(fin_velocity),
        selectedFinVelMod
      );
    }

    let steps = "";

    // Both Distance (s) and Acceleration (a) are missing
    if (displacement === "" && acceleration === "") {
      const newAcceleration = (fin_velocity - init_velocity) / time;
      const newDisplacement =
        init_velocity * time + 0.5 * newAcceleration * Math.pow(time, 2);
      steps = `
        \\begin{align*}
        &\\text{Given: } u = ${init_velocity} \\text{ m/s}, v = ${fin_velocity} \\text{ m/s}, t = ${time.toFixed(
        2
      )} \\text{ s} \\\\
        &\\text{Acceleration: } a = \\frac{v - u}{t} = \\frac{${fin_velocity} - ${init_velocity}}{${time.toFixed(
        2
      )}} = ${newAcceleration.toFixed(2)} \\text{ m/s}^2 \\\\
        &\\text{Displacement: } s = ut + \\frac{1}{2}at^2 = ${init_velocity} \\times ${time.toFixed(
        2
      )} + \\frac{1}{2} \\times ${newAcceleration.toFixed(
        2
      )} \\times ${time.toFixed(2)}^2 = ${newDisplacement.toFixed(2)} \\text{ m}
        \\end{align*}
        `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        acceleration: newAcceleration.toFixed(2),
        displacement: newDisplacement.toFixed(2),
      }));
    }
    // Both Distance (s) and Time (t) are missing
    else if (displacement === "" && time === "") {
      const newTime = (fin_velocity - init_velocity) / acceleration;
      const newDisplacement =
        init_velocity * newTime + 0.5 * acceleration * Math.pow(newTime, 2);
      steps = `
        \\begin{align*}
        &\\text{Given: } u = ${init_velocity} \\text{ m/s}, v = ${fin_velocity} \\text{ m/s}, a = ${acceleration} \\text{ m/s}^2 \\\\
        &\\text{Time: } t = \\frac{v - u}{a} = \\frac{${fin_velocity} - ${init_velocity}}{${acceleration}} = ${newTime.toFixed(
        2
      )} \\text{ s} \\\\
        &\\text{Displacement: } s = ut + \\frac{1}{2}at^2 = ${init_velocity} \\times ${newTime.toFixed(
        2
      )} + \\frac{1}{2} \\times ${acceleration} \\times ${newTime.toFixed(
        2
      )}^2 = ${newDisplacement.toFixed(2)} \\text{ m}
        \\end{align*}
      `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        time: newTime.toFixed(2),
        displacement: newDisplacement.toFixed(2),
      }));
    }
    // Both Distance (s) and Initial Velocity (u) are missing
    else if (displacement === "" && init_velocity === "") {
      const newInitVelocity = fin_velocity - acceleration * time;
      const newDisplacement =
        newInitVelocity * time + 0.5 * acceleration * Math.pow(time, 2);
      steps = `
        \\begin{align*}
        &\\text{Given: } v = ${fin_velocity} \\text{ m/s}, a = ${acceleration} \\text{ m/s}^2, t = ${time.toFixed(
        2
      )} \\text{ s} \\\\
        &\\text{Initial Velocity: } u = v - at = ${fin_velocity} - ${acceleration} \\times ${time.toFixed(
        2
      )} = ${newInitVelocity.toFixed(2)} \\text{ m/s} \\\\
        &\\text{Displacement: } s = ut + \\frac{1}{2}at^2 = ${newInitVelocity.toFixed(
          2
        )} \\times ${time.toFixed(
        2
      )} + \\frac{1}{2} \\times ${acceleration} \\times ${time.toFixed(
        2
      )}^2 = ${newDisplacement.toFixed(2)} \\text{ m}
        \\end{align*}
      `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        init_velocity: newInitVelocity.toFixed(2),
        displacement: newDisplacement.toFixed(2),
      }));
    }
    // Both Distance (s) and Final Velocity (v) are missing
    else if (displacement === "" && fin_velocity === "") {
      const newFinVelocity = init_velocity + acceleration * time;
      const newDisplacement =
        init_velocity * time + 0.5 * acceleration * Math.pow(time, 2);
      steps = `
        \\begin{align*}
        &\\text{Given: } u = ${init_velocity} \\text{ m/s}, a = ${acceleration} \\text{ m/s}^2, t = ${time.toFixed(
        2
      )} \\text{ s} \\\\
        &\\text{Final Velocity: } v = u + at = ${init_velocity} + ${acceleration} \\times ${time.toFixed(
        2
      )} = ${newFinVelocity.toFixed(2)} \\text{ m/s} \\\\
        &\\text{Displacement: } s = ut + \\frac{1}{2}at^2 = ${init_velocity} \\times ${time.toFixed(
        2
      )} + \\frac{1}{2} \\times ${acceleration} \\times ${time.toFixed(
        2
      )}^2 = ${newDisplacement.toFixed(2)} \\text{ m}
        \\end{align*}
      `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        fin_velocity: newFinVelocity.toFixed(2),
        displacement: newDisplacement.toFixed(2),
      }));
    }
    // Both Acceleration (a) and Time (t) are missing
    else if (acceleration === "" && time === "") {
      const newTime = (2 * displacement) / (init_velocity + fin_velocity);
      const newAcceleration = (fin_velocity - init_velocity) / newTime;
      steps = `
        \\begin{align*}
        &\\text{Given: } s = ${displacement} \\text{ m}, u = ${init_velocity} \\text{ m/s}, v = ${fin_velocity} \\text{ m/s} \\\\
        &\\text{Time: } t = \\frac{2s}{u + v} = \\frac{2 \\times ${displacement}}{${init_velocity} + ${fin_velocity}} = ${newTime.toFixed(
        2
      )} \\text{ s} \\\\
        &\\text{Acceleration: } a = \\frac{v - u}{t} = \\frac{${fin_velocity} - ${init_velocity}}{${newTime.toFixed(
        2
      )}} = ${newAcceleration.toFixed(2)} \\text{ m/s}^2
        \\end{align*}
      `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        acceleration: newAcceleration.toFixed(2),
        time: newTime.toFixed(2),
      }));
    }
    // Both Acceleration (a) and Initial Velocity (u) are missing
    else if (acceleration === "" && init_velocity === "") {
      const newAcceleration =
        (2 * (displacement - fin_velocity * time)) / Math.pow(time, 2);
      const newInitVelocity = fin_velocity - newAcceleration * time;
      steps = `
        \\begin{align*}
        &\\text{Given: } s = ${displacement} \\text{ m}, v = ${fin_velocity} \\text{ m/s}, t = ${time.toFixed(
        2
      )} \\text{ s} \\\\
        &\\text{Acceleration: } a = \\frac{2(s - vt)}{t^2} = \\frac{2(${displacement} - ${fin_velocity} \\times ${time.toFixed(
        2
      )})}{${time.toFixed(2)}^2} = ${newAcceleration.toFixed(
        2
      )} \\text{ m/s}^2 \\\\
        &\\text{Initial Velocity: } u = v - at = ${fin_velocity} - ${newAcceleration.toFixed(
        2
      )} \\times ${time.toFixed(2)} = ${newInitVelocity.toFixed(2)} \\text{ m/s}
        \\end{align*}
      `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        acceleration: newAcceleration.toFixed(2),
        init_velocity: newInitVelocity.toFixed(2),
      }));
    }
    // Both Acceleration (a) and Final Velocity (v) are missing
    else if (acceleration === "" && fin_velocity === "") {
      const newAcceleration =
        (2 * (displacement - init_velocity * time)) / Math.pow(time, 2);
      const newFinVelocity = init_velocity + newAcceleration * time;
      steps = `
        \\begin{align*}
        &\\text{Given: } s = ${displacement} \\text{ m}, u = ${init_velocity} \\text{ m/s}, t = ${time.toFixed(
        2
      )} \\text{ s} \\\\
        &\\text{Acceleration: } a = \\frac{2(s - ut)}{t^2} = \\frac{2(${displacement} - ${init_velocity} \\times ${time.toFixed(
        2
      )})}{${time.toFixed(2)}^2} = ${newAcceleration.toFixed(
        2
      )} \\text{ m/s}^2 \\\\
        &\\text{Final Velocity: } v = u + at = ${init_velocity} + ${newAcceleration.toFixed(
        2
      )} \\times ${time.toFixed(2)} = ${newFinVelocity.toFixed(2)} \\text{ m/s}
        \\end{align*}
      `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        acceleration: newAcceleration.toFixed(2),
        fin_velocity: newFinVelocity.toFixed(2),
      }));
    }
    // Both Initial Velocity (u) and Time (t) are missing
    else if (init_velocity === "" && time === "") {
      const newTime =
        (fin_velocity -
          Math.sqrt(
            Math.pow(fin_velocity, 2) - 2 * acceleration * displacement
          )) /
        acceleration;
      const newInitVelocity = fin_velocity - acceleration * newTime;
      steps = `
        \\begin{align*}
        &\\text{Given: } s = ${displacement} \\text{ m}, v = ${fin_velocity} \\text{ m/s}, a = ${acceleration} \\text{ m/s}^2 \\\\
        &\\text{Time: } t = \\frac{v - \\sqrt{v^2 - 2as}}{a} = \\frac{${fin_velocity} - \\sqrt{${fin_velocity}^2 - 2 \\times ${acceleration} \\times ${displacement}}}{${acceleration}} = ${newTime.toFixed(
        2
      )} \\text{ s} \\\\
        &\\text{Initial Velocity: } u = v - at = ${fin_velocity} - ${acceleration} \\times ${newTime.toFixed(
        2
      )} = ${newInitVelocity.toFixed(2)} \\text{ m/s}
        \\end{align*}
      `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        init_velocity: newInitVelocity.toFixed(2),
        time: newTime.toFixed(2),
      }));
    }
    // Both Final Velocity (v) and Time (t) are missing
    else if (fin_velocity === "" && time === "") {
      const newTime =
        (Math.sqrt(
          Math.pow(init_velocity, 2) + 2 * acceleration * displacement
        ) -
          init_velocity) /
        acceleration;
      const newFinVelocity = init_velocity + acceleration * newTime;
      steps = `
        \\begin{align*}
        &\\text{Given: } s = ${displacement} \\text{ m}, u = ${init_velocity} \\text{ m/s}, a = ${acceleration} \\text{ m/s}^2 \\\\
        &\\text{Time: } t = \\frac{\\sqrt{u^2 + 2as} - u}{a} = \\frac{\\sqrt{${init_velocity}^2 + 2 \\times ${acceleration} \\times ${displacement}} - ${init_velocity}}{${acceleration}} = ${newTime.toFixed(
        2
      )} \\text{ s} \\\\
        &\\text{Final Velocity: } v = u + at = ${init_velocity} + ${acceleration} \\times ${newTime.toFixed(
        2
      )} = ${newFinVelocity.toFixed(2)} \\text{ m/s}
        \\end{align*}
      `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        fin_velocity: newFinVelocity.toFixed(2),
        time: newTime.toFixed(2),
      }));
    }

    // Both Initial Velocity (u) and Final Velocity (v) are missing
    else if (init_velocity === "" && fin_velocity === "") {
      const newInitVelocity =
        (displacement - 0.5 * acceleration * Math.pow(time, 2)) / time;
      const newFinVelocity = newInitVelocity + acceleration * time;
      steps = `
    \\begin{align*}
    &\\text{Given: } s = ${displacement} \\text{ m}, a = ${acceleration} \\text{ m/s}^2, t = ${time.toFixed(
        2
      )} \\text{ s} \\\\
    &\\text{Initial Velocity: } u = \\frac{s - \\frac{1}{2} a t^2}{t} = \\frac{${displacement} - \\frac{1}{2} \\times ${acceleration} \\times ${time.toFixed(
        2
      )}^2}{${time.toFixed(2)}} = ${newInitVelocity.toFixed(
        2
      )} \\text{ m/s} \\\\
    &\\text{Final Velocity: } v = u + at = ${newInitVelocity.toFixed(
      2
    )} + ${acceleration} \\times ${time.toFixed(2)} = ${newFinVelocity.toFixed(
        2
      )} \\text{ m/s}
    \\end{align*}
  `;
      setCalculatedValues((prevValues) => ({
        ...prevValues,
        init_velocity: newInitVelocity.toFixed(2),
        fin_velocity: newFinVelocity.toFixed(2),
      }));
    }

    setStepByStep(steps);
  };

  useEffect(() => {
    if (countNonEmptyInputs() === 3) {
      calcKine();
    }
  }, [userInputs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  let reload = () => {
    window.location.reload();
  };

  const [isContainerFocused, setIsContainerFocused] = useState(false);

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <>
        <h1 className="header">Kinematics Calculator</h1>
        <div className={`background ${isContainerFocused ? "blur" : ""}`}></div>
        <div
          className={`container ${isContainerFocused ? "focused" : ""}`}
          tabIndex="0"
          onFocus={() => setIsContainerFocused(true)}
          onBlur={() => setIsContainerFocused(false)}
        >
          <div className="input-select-container">
            <label>Displacement:</label>
            <input
              type="number"
              name="displacement"
              value={userInputs.displacement}
              onChange={handleChange}
            />
            <select
              value={selectedDisplacementMod}
              onChange={handleSelectDisplacementMod}
            >
              <option value="m">m</option>
              <option value="cm">cm</option>
              <option value="km">km</option>
            </select>
          </div>
          <div className="input-select-container">
            <label>Initial Velocity:</label>
            <input
              type="number"
              name="init_velocity"
              value={userInputs.init_velocity}
              onChange={handleChange}
            />
            <select
              value={selectedInitVelMod}
              onChange={handleSelectInitVelMod}
            >
              <option value="m/s">m/s</option>
              <option value="cm/s">cm/s</option>
              <option value="km/h">km/h</option>
            </select>
          </div>
          <div className="input-select-container">
            <label>Final Velocity: </label>
            <input
              type="number"
              name="fin_velocity"
              value={userInputs.fin_velocity}
              onChange={handleChange}
            />
            <select value={selectedFinVelMod} onChange={handleSelectFinVelMod}>
              <option value="m/s">m/s</option>
              <option value="cm/s">cm/s</option>
              <option value="km/h">km/h</option>
            </select>
          </div>
          <div className="input-select-container">
            <label>Acceleration:</label>
            <input
              type="number"
              name="acceleration"
              value={userInputs.acceleration}
              onChange={handleChange}
            />
            <select
              value={selectedAccelerationMod}
              onChange={handleSelectAccelerationMod}
            >
              <option value="m/s²">m/s²</option>
              <option value="cm/s²">cm/s²</option>
              <option value="km/h²">km/h²</option>
            </select>
          </div>
          <div className="input-select-container">
            <label>Time:</label>
            <input
              type="number"
              name="time"
              value={userInputs.time}
              onChange={handleChange}
            />
            <select value={selectedTimeMod} onChange={handleSelectTimeMod}>
              <option value="s">s</option>
              <option value="min">min</option>
              <option value="h">h</option>
            </select>
          </div>
          <div>
            <button className="btn" onClick={reload} type="submit">
              reset
            </button>
          </div>
        </div>
        <div className="results-container">
          <MathJax className="mathjax-steps">
            <div dangerouslySetInnerHTML={{ __html: stepByStep }} />
          </MathJax>
        </div>
      </>
    </MathJaxContext>
  );
}

export default App;

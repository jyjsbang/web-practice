import React, { useState } from 'react';

function App() {
  // 상태: 배경색 저장
  const [bgColor, setBgColor] = useState('white');

  // 랜덤 색상 생성 함수
  const changeColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    setBgColor(randomColor);
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: bgColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      onClick={changeColor} // 배경 클릭 시 색상 변경
    >
      <h1>클릭해서 배경색 변경</h1>
      <button onClick={(e) => { e.stopPropagation(); changeColor(); }}>
        버튼으로도 변경
      </button>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import Loading from './components/Loading.jsx';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    console.log('로딩 완료!');
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="App">
      <h1>로딩이 완료되었습니다!</h1>
      <p>키보드 타이핑 애니메이션이 잘 작동했나요?</p>
      <button onClick={() => setIsLoading(true)}>다시 보기</button>
    </div>
  );
}

export default App;
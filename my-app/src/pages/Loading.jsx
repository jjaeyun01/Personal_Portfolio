import React, { useState, useEffect } from 'react';
import './Loading.css';

// 텍스트를 상수로 선언
const TEXT_TO_TYPE = "JAEYOON LEE";

const Loading = ({ onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [pressedKey, setPressedKey] = useState(null);

  useEffect(() => {
    // 1. useRef 대신 지역 변수 사용
    // 이 변수는 이 useEffect 실행 환경에만 속합니다.
    let isCancelled = false;

    const pressKey = (char) => {
      return new Promise((resolve) => {
        // 2. 실행이 취소되었는지 확인
        if (isCancelled) {
          resolve(); // 프로미스를 즉시 해결(resolve)하여 다음 await이 멈추지 않게 함
          return;
        }

        setPressedKey(char);

        // 3. (가장 중요!) 상태 업데이트 함수 내부에서 한 번 더 확인
        // 이중 실행 시 첫 번째 렌더링의 상태 업데이트를 막습니다.
        setDisplayText(prev => {
          if (isCancelled) {
            return prev; // 취소되었다면, 이전 상태(prev)를 그대로 반환
          }
          return prev + char; // 취소되지 않았다면, 글자 추가
        });
        
        setTimeout(() => {
          setPressedKey(null);
          resolve();
        }, 250);
      });
    };

    const typeText = async () => {
      for (let char of TEXT_TO_TYPE) {
        if (isCancelled) return;
        await pressKey(char);
        if (isCancelled) return;
        await new Promise(res => setTimeout(res, 200));
      }
      
      if (isCancelled) return;

      setTimeout(() => {
        // setTimeout 내부에서도 확인 (선택 사항이지만 안전함)
        if (!isCancelled && onComplete) {
          onComplete();
        }
      }, 1000);
    };

    typeText();

    // 4. 클린업 함수: 컴포넌트가 unmount 되면, 
    // 이 useEffect 환경의 isCancelled 변수만 true로 설정됩니다.
    return () => {
      isCancelled = true;
    };
    
  }, [onComplete]); // 의존성 배열

  // ... (getKeyClass와 return JSX는 동일) ...

  const getKeyClass = (keyChar) => {
    if (pressedKey === keyChar || 
        (pressedKey === ' ' && keyChar === 'space')) {
      return 'pressed';
    }
    return '';
  };

  return (
    <div className="loading-container">
      <div className="typing-text">{displayText}</div>
      <div className="keyboard">
        {/* 키보드 JSX 생략 */}
        <div className="row">
          <div className={`key-esc ${getKeyClass('ESC')}`}>esc</div>
          <div className={`key ${getKeyClass('F1')}`}>F1</div>
          <div className={`key ${getKeyClass('F2')}`}>F2</div>
          <div className={`key ${getKeyClass('F3')}`}>F3</div>
          <div className={`key ${getKeyClass('F4')}`}>F4</div>
          <div className={`key ${getKeyClass('F5')}`}>F5</div>
          <div className={`key ${getKeyClass('F6')}`}>F6</div>
          <div className={`key ${getKeyClass('F7')}`}>F7</div>
          <div className={`key ${getKeyClass('F8')}`}>F8</div>
          <div className={`key ${getKeyClass('F9')}`}>F9</div>
          <div className={`key ${getKeyClass('F10')}`}>F10</div>
          <div className={`key ${getKeyClass('F11')}`}>F11</div>
          <div className={`key ${getKeyClass('F12')}`}>F12</div>
          <div className={`key-id ${getKeyClass('⏻')}`}>⏻</div>
        </div>

        <div className="row">
          <div className={`key ${getKeyClass('`')}`}>
            <span className="top">~</span>
            <span className="bottom">`</span>
          </div>
          <div className={`key ${getKeyClass('1')}`}>
            <span className="top">!</span>
            <span className="bottom">1</span>
          </div>
          <div className={`key ${getKeyClass('2')}`}>
            <span className="top">@</span>
            <span className="bottom">2</span>
          </div>
          <div className={`key ${getKeyClass('3')}`}>
            <span className="top">#</span>
            <span className="bottom">3</span>
          </div>
          <div className={`key ${getKeyClass('4')}`}>
            <span className="top">$</span>
            <span className="bottom">4</span>
          </div>
          <div className={`key ${getKeyClass('5')}`}>
            <span className="top">%</span>
            <span className="bottom">5</span>
          </div>
          <div className={`key ${getKeyClass('6')}`}>
            <span className="top">^</span>
            <span className="bottom">6</span>
          </div>
          <div className={`key ${getKeyClass('7')}`}>
            <span className="top">&</span>
            <span className="bottom">7</span>
          </div>
          <div className={`key ${getKeyClass('8')}`}>
            <span className="top">*</span>
            <span className="bottom">8</span>
          </div>
          <div className={`key ${getKeyClass('9')}`}>
            <span className="top">(</span>
            <span className="bottom">9</span>
          </div>
          <div className={`key ${getKeyClass('0')}`}>
            <span className="top">)</span>
            <span className="bottom">0</span>
          </div>
          <div className={`key ${getKeyClass('-')}`}>
            <span className="top">_</span>
            <span className="bottom">-</span>
          </div>
          <div className={`key ${getKeyClass('=')}`}>
            <span className="top">+</span>
            <span className="bottom">=</span>
          </div>
          <div className={`key-delete ${getKeyClass('DELETE')}`}>delete</div>
        </div>

        <div className="row">
          <div className={`key-tab ${getKeyClass('TAB')}`}>tab</div>
          <div className={`key ${getKeyClass('Q')}`}>Q</div>
          <div className={`key ${getKeyClass('W')}`}>W</div>
          <div className={`key ${getKeyClass('E')}`}>E</div>
          <div className={`key ${getKeyClass('R')}`}>R</div>
          <div className={`key ${getKeyClass('T')}`}>T</div>
          <div className={`key ${getKeyClass('Y')}`}>Y</div>
          <div className={`key ${getKeyClass('U')}`}>U</div>
          <div className={`key ${getKeyClass('I')}`}>I</div>
          <div className={`key ${getKeyClass('O')}`}>O</div>
          <div className={`key ${getKeyClass('P')}`}>P</div>
          <div className={`key ${getKeyClass('[')}`}>
            <span className="top">{'{'}</span>
            <span className="bottom">[</span>
          </div>
          <div className={`key ${getKeyClass(']')}`}>
            <span className="top">{'}'}</span>
            <span className="bottom">]</span>
          </div>
          <div className={`key ${getKeyClass('\\')}`}>
            <span className="top">|</span>
            <span className="bottom">\</span>
          </div>
        </div>

        <div className="row">
          <div className={`key-capslock ${getKeyClass('CAPS')}`}>caps lock</div>
          <div className={`key ${getKeyClass('A')}`}>A</div>
          <div className={`key ${getKeyClass('S')}`}>S</div>
          <div className={`key ${getKeyClass('D')}`}>D</div>
          <div className={`key ${getKeyClass('F')}`}>F</div>
          <div className={`key ${getKeyClass('G')}`}>G</div>
          <div className={`key ${getKeyClass('H')}`}>H</div>
          <div className={`key ${getKeyClass('J')}`}>J</div>
          <div className={`key ${getKeyClass('K')}`}>K</div>
          <div className={`key ${getKeyClass('L')}`}>L</div>
          <div className={`key ${getKeyClass(';')}`}>
            <span className="top">:</span>
            <span className="bottom">;</span>
          </div>
          <div className={`key ${getKeyClass("'")}`}>
            <span className="top">"</span>
            <span className="bottom">'</span>
          </div>
          <div className={`key-return ${getKeyClass('RETURN')}`}>return</div>
        </div>

        <div className="row">
          <div className={`key-shift-left ${getKeyClass('SHIFT')}`}>shift</div>
          <div className={`key ${getKeyClass('Z')}`}>Z</div>
          <div className={`key ${getKeyClass('X')}`}>X</div>
          <div className={`key ${getKeyClass('C')}`}>C</div>
          <div className={`key ${getKeyClass('V')}`}>V</div>
          <div className={`key ${getKeyClass('B')}`}>B</div>
          <div className={`key ${getKeyClass('N')}`}>N</div>
          <div className={`key ${getKeyClass('M')}`}>M</div>
          <div className={`key ${getKeyClass(',')}`}>
            <span className="top">&lt;</span>
            <span className="bottom">,</span>
          </div>
          <div className={`key ${getKeyClass('.')}`}>
            <span className="top">&gt;</span>
            <span className="bottom">.</span>
          </div>
          <div className={`key ${getKeyClass('/')}`}>
            <span className="top">?</span>
            <span className="bottom">/</span>
          </div>
          <div className={`key-shift-right ${getKeyClass('SHIFT')}`}>shift</div>
        </div>

        <div className="row">
          <div className={`key-fn ${getKeyClass('FN')}`}>
            <span className="top">fn</span>
            <span className="bottom">🌐︎</span>
          </div>
          <div className={`key-control ${getKeyClass('CTRL')}`}>
            <span className="top">^</span>
            <span className="bottom">control</span>
          </div>
          <div className={`key-option-left ${getKeyClass('OPT')}`}>
            <span className="top">⌥</span>
            <span className="bottom">option</span>
          </div>
          <div className={`key-command-left ${getKeyClass('CMD')}`}>
            <span className="top">⌘</span>
            <span className="bottom">command</span>
          </div>
          <div className={`key-space ${getKeyClass(' ')}`}></div>
          <div className={`key-command-right ${getKeyClass('CMD')}`}>
            <span className="top">⌘</span>
            <span className="bottom">command</span>
          </div>
          <div className={`key-option-right ${getKeyClass('OPT')}`}>
            <span className="top">⌥</span>
            <span className="bottom">option</span>
          </div>
          <div className="arrow-keys">
            <div className={`key arrow-left ${getKeyClass('←')}`}>◀︎</div>
            <div className="arrow-updown">
              <div className={`key arrow-up ${getKeyClass('↑')}`}>▲</div>
              <div className={`key arrow-down ${getKeyClass('↓')}`}>▼</div>
            </div>
            <div className={`key arrow-right ${getKeyClass('→')}`}>►</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

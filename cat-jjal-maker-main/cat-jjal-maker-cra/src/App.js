import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from './components/title';

console.log("야옹");

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/cat/${responseJson._id}/says/${text}`; // NOTE: API 스펙 변경으로 강의 영상과 다른 URL로 변경했습니다.
};

function CatItem(props) {
  return (
    <li>
      <img src={props.img}/>
    </li>
  );
}



function Favorites({favorites}) {
  if(favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이를 저장해 주세요!</div>
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat}/>  
      ))}
    </ul>
  );
}



const Form = ({updateMainCat}) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  function handleInputChange(e) {
    setValue(e.target.value.toUpperCase());
    setErrorMessage("");
    if(includesHangul(value)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    }
  }
  function handlerFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if(value === ""){
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }

    updateMainCat(value);
  }
  
  return (
    <div>
      <form onSubmit={handlerFormSubmit}>
        <input 
          type="text" 
          name="name" 
          onChange={handleInputChange} 
          value={value}
          placeholder="영어 대사를 입력해주세요" />
        <button type="submit">생성2</button>
        <p style={{color:"red"}}>{errorMessage}</p>
      </form>
    </div>
  );
}

const MainCard = ({img, onHeartClick, alreadyFavorite}) => {

  const heartIcon = alreadyFavorite ? "💖" : "🤍";

  return (
    <div className="main-card">
      <img
        src={img}
        alt="고양이"
        width="400"
      />
      <button  
        onClick={onHeartClick}
      >{heartIcon}</button>
    </div>
  );
}

const App = () => {/*
  const CAT1 = "https://cdn.straightnews.co.kr/news/photo/202409/253829_158493_3815.jpg"
  const CAT2 = "https://cdn.mhnse.com/news/photo/202409/320788_361963_2612.jpg"
  const CAT3 = "https://blog.kakaocdn.net/dn/ST84c/btsDhUN8AZg/MiQi2njlGookkbMaKwPlo1/img.jpg" */

  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [mainImage, setmainImage] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || []
  });

  const alreadyFavorite = favorites.includes(mainImage);

  async function setInitialCat() {
    const newCat = await fetchCat('First cat');
    console.log(newCat);
    setmainImage(newCat);
  }

  React.useEffect(() =>{
    setInitialCat();
  }, [])

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setmainImage(newCat);
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    console.log("하트 눌렀음");
    const nextFavorites = [...favorites, mainImage];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }
  
  const counterTitle = counter === null ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{counterTitle} 고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat}/>
      <MainCard alreadyFavorite={alreadyFavorite} img={mainImage} onHeartClick={handleHeartClick}></MainCard>
      <Favorites favorites={favorites}/> 
    </div>
  );
}

export default App;

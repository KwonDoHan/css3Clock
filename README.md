CSS3 Clock
----------

CSS3의 `transform`을 이용해서 로컬시스템의 시간을 간단히 보여주는 시계를 만든다.

### 움직이지 않는 부분 ###

시계에서 움직이지 않는 부분을 먼저 만든다.
HTML 태그로는 아래 정도가 필요하다.
물론 JavaScript로 엘리먼트를 추가하는 방법을 사용해도 되겠지만, 어차피 한 번만 추가하면 될 내용이니까 굳이 코드를 복잡하게 만들 필요는 없다.

```html
<body>
    <div id="clock">
        <div id="core"></div>
    </div>
</body>
```

두 `DIV` 엘리먼트에 대한 스타일을 아래와 같이 설정하였다.
처음에는 단순했지만 이것저것 꾸미려다 보니 약간 지저분해 보일 정도로 군더더기들이 붙었다.
그림 파일을 사용하지 않고 시계를 제법 꾸며보려니 필요한 것이라고 생각하면 된다.

```css
#clock {
  position: relative;
  top: 10px; left: 10px;
  width: 400px; height: 400px;
  border: 20px solid rgba(30, 30, 30, 0.9);
  border-radius: 400px;
  box-shadow: 2px 4px 8px rgba(50, 50, 50, 0.8);
}
#core {
  position: absolute;
  top: 140px; left: 140px;
  width: 40px; height: 40px;
  border-radius: 60px;
  background: rgba(50, 50, 50, 0.6);
  border: 40px solid rgba(50, 50, 50, 0.6);
  box-shadow: 2px 4px 8px rgba(50, 50, 50, 0.8);
  z-index: 10;
}
```

테두리와 시계의 중심 꾸미기를 마쳤으니 다음으로 1부터 12까지의 숫자를 적당한 위치에 그려야 할 차례다.

숫자는 일단 시계와 동일한 폭과 너비를 가지도록 하고, 예로써 숫자 '1'의 경우 30도 회전시킨 후, 적당히 이동하고, 보기 편하게 다시 반대로 30도 회전시킨다(`rotate(30deg) translate(0px, -165px) rotate(-30deg)`).
이와 같은 방법으로 1부터 12까지의 숫자를 표시해 주면 된다.

```javascript
// 시계 숫자 표시
var clockElement = document.getElementById("clock");
for (var i = 1; i <= 12; i++) {
    var numElement = document.createElement("div");
    numElement.innerHTML = i;
    numElement.classList.add("number");
    css(numElement, { transform: "rotate(" + (i * 30) + "deg) translate(0px, -165px) rotate(-" + (i * 30) + "deg)" });
    clockElement.appendChild(numElement);
}
```

분/초 단위의 눈금도 이와 같은 방법으로 추가할 수 있다.
다만 분/초 단위이므로 360도를 60분/초로 나누어서 1분/초는 6도씩 회전을 한다는 점과 5분/초마다 강조를 위해 글꼴 크기(`fontSize`)와 굵기(`fontWeight`) 값을 추가한 정도가 다르다.

```javascript
// 시계 테두리의 눈금(mark) 표시
for (var i = 0; i < 60; i++) {
    var markElement = document.createElement("div");
    markElement.innerHTML = "|";
    markElement.classList.add("mark");
    css(markElement, { transform: "rotate(" + (i * 6) + "deg) translate(0px, -196px)" });
    if (i % 5 == 0) {
        css(markElement, { fontSize: "20px", fontWeight: "bold" });
    }
    clockElement.appendChild(markElement);
}
```

### 움직이는 시/분/초침 추가하기 ###


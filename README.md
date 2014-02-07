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

시/분/초침을 시계에 추가하기 위해서 아래와 같이 3개의 엘리먼트를 `#clock` 엘리먼트의 자식 노드로 추가한다.

```html
<div id="seconds" class="handofwatch"></div>
<div id="minutes" class="handofwatch"></div>
<div id="hours" class="handofwatch"></div>
```

그리고 이제 CSS 값을 적당히 변경해 줌으로써 시계가 움직이도록 만들어 보자.
가장 기본은 `setInterval` 함수를 사용하는 것이다.
이 함수를 통해서 1초마다 현재 시간을 가져와서 시/분/초침에 해당하는 엘리먼트를 적당히 이동/회전시킬 것이다.

아래 코드가 이 내용을 전부 다루고 있다.
분/초침은 현재 값에 따라 6도씩 곱하면 얼마나 회전시켜야 하는지 알 수 있다.
시침의 경우는 약간의 계산이 더 필요하다.
아래 예제에서 hourDeg 변수 값을 계산하는 것이 그 내용이다.
말로 표현하자면, 시침은 초기 회전 값 180도(`DIV` 엘리먼트의 초기 이동과 관련 있음)에 1시간에 30도 회전하고, 1분에 0.5도씩 회전한 값이 최종적으로 회전해야 할 값이 된다.

```javascript
    // 시계 침 계산
var secElement = document.getElementById("seconds");
var minElement = document.getElementById("minutes");
var hourElement = document.getElementById("hours");

var defaults = {
  sec:  { width:  4, height: 160 },
  min:  { width: 14, height: 180 },
  hour: { width: 16, height: 120 }
}

var sec = 0, min = 0, hour = 0;
setInterval( function () {
  sec = new Date().getSeconds();
  min = new Date().getMinutes();
  hour = new Date().getHours();

  css(secElement, {
    width: defaults.sec.width + "px",
    height: defaults.sec.height + "px",
    transformOrigin: (defaults.sec.width / 2) + "px 0px 0",
    transform: "translate(" + (200 - defaults.sec.width / 2) + "px, 200px) rotate(" + (180 + sec * 6) + "deg)" 
  });

  css(minElement, {
    width: defaults.min.width + "px",
    height: defaults.min.height + "px",
    transformOrigin: (defaults.min.width / 2) + "px 0px 0",
    transform: "translate(" + (200 - defaults.min.width / 2) + "px, 200px) rotate(" + (180 + min * 6) + "deg)" 
  });

  var hourDeg = 180 + (hour % 12) * 30 + min / 2;

  css(hourElement, {
    width: defaults.hour.width + "px",
    height: defaults.hour.height + "px",
    transformOrigin: (defaults.hour.width / 2) + "px 0px 0",
    transform: "translate(" + (200 - defaults.hour.width / 2) + "px, 200px) rotate(" + hourDeg + "deg)" 
  });
}, 1000);
```

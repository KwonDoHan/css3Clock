domReady (function () {
  // 시계 숫자 표시
  var clockElement = document.getElementById("clock");
  for (var i = 1; i <= 12; i++) {
    var numElement = document.createElement("div");
    numElement.innerHTML = i;
    numElement.classList.add("number");
    css(numElement, { transform: "rotate(" + (i * 30) + "deg) translate(0px, -165px) rotate(-" + (i * 30) + "deg)" });
    clockElement.appendChild(numElement);
  }

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
});

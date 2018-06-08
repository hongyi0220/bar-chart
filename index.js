$(app);
function app() {
  (function drawChart() {
    var container = $(".container");
    var svg = $("svg");
    var select = $("#options");
    var tooltip = $(".tooltip");
    var viewBoxHeight = 0;
    var colors = ['#F44336', '#607D8B', '#009688', '#FFC107', '#9C27B0', '#3F51B5', '#8BC34A'];
    var colorsReversed = [...colors].reverse();

    function makeSVG(tag, attrs) {
      var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
      return el;
    }

    function makeBars(key) {
      var maxNum = Math.max(...dataset.map(d => d[key]));
      var divideBy = 10 ** (maxNum.toString().length - 1);

      return dataset.sort((a, b) => b[key] - a[key]).map((data, i) => {
        viewBoxHeight += 10;
        var bar = makeSVG("rect", {
          x: 0,
          y: (i + .47) * 10 ,
          width: data[key] >= 100 ? 50 * data[key] / divideBy : data[key],
          height: '5px',
          'data-val': data[key],
          'data-key': key,
          id: i,
          fill: colors[i],
        });
          bar.addEventListener('mousemove', handleBarMouseover);
          bar.addEventListener('mouseout', handleBarMouseout);
          return bar;
      });
    }

    function makeLabels() {
      return dataset.sort((a, b) => b[key] - a[key]).map((data, i) => {
        var label = makeSVG("text", {
          x: 0,
          y: (i + .47) * 10,
          fill: '#795548',
        });
        label.textContent = data.name;
        label.style.fontSize = '.4em';
        return label;
      });
    }

    function makeSeletors() {
      ["age", "salary", ].forEach((value, i) => {
        select.append($("<option>", {
          value,
          text: value.toUpperCase(),
          selected: i === 0 && true,
        }));
      });
    }

    function handleSelectChange(evt) {
      if (evt.target.value) {
        viewBoxHeight = 0
        $("rect").remove();
        $("text").remove();
        var bars = makeBars(evt.target.value);
        var labels = makeLabels();
        svg.attr('viewBox', '0 0 100 ' + viewBoxHeight)
        svg.append(bars);
        svg.append(labels);
      }
    }

    function handleBarMouseover(evt) {
      var color = colorsReversed[+evt.srcElement.id];
      var yo = evt.srcElement.dataset.key === 'age' ? ' yo' : '';
      var moola = evt.srcElement.dataset.key === 'salary' ? '$' : '';
      
      tooltip.html('<span>' + moola + evt.srcElement.dataset.val + yo +'</span>');
      $('span').css('color', color);
      tooltip.css({
        'top': (evt.screenY - 130) + 'px',
        'left': (evt.screenX - 55) + 'px',
        'visibility': 'visible',
      });
    }

    function handleBarMouseout() {
      tooltip.css({
        'visibility': 'hidden',
      });
    }

    (function init() {
      makeSeletors();
      var bars = makeBars("age");
      var labels = makeLabels();
      var horizontalLine = makeSVG("line", {
        x1: 0,
        x2: 80,
        y1: viewBoxHeight,
        y2: viewBoxHeight,
        stroke: 'gray',
        'stroke-width': .4,
      });
      var verticalLine = makeSVG("line", {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: viewBoxHeight,
        stroke: 'gray',
        'stroke-width': .4,
      });

      svg.append(horizontalLine);
      svg.append(verticalLine);
      svg.attr('viewBox', '0 0 100 ' + viewBoxHeight)
      svg.append(bars);
      svg.append(labels);
      select.change(handleSelectChange);
    })();

  })();
}

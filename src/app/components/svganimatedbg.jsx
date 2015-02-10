var React = require('react');

var SvgAnimatedBackground = React.createClass({
  render: function() {
    return (
      <svg x="0px" y="0px" viewBox="0 0 1920 400" space="preserve" id="background" dangerouslySetInnerHTML={{__html:
          '<defs>\
          <linearGradient x1="0%" y1="0%" x2="0%" y2="100%" id="svg_18">\
           <stop stop-opacity="0" stop-color="#ffffff" offset="0"/>\
           <stop stop-color="#549395" offset="0.6" opacity="1"/>\
          </linearGradient>\
          <filter xmlns="http://www.w3.org/2000/svg" id="dropshadow" height="200%">\
            <feGaussianBlur in="SourceAlpha" stdDeviation="8"/> \
            <feOffset dx="2" dy="2" result="offsetblur"/>\
            <feComponentTransfer>\
              <feFuncA type="linear" slope="0.7"/>\
            </feComponentTransfer>\
            <feMerge> \
              <feMergeNode/>\
              <feMergeNode in="SourceGraphic"/> \
            </feMerge>\
          </filter>\
        </defs>\
        <g>\
            <path id="svg_23" d="m960,240l-1473,-154l-42,-222l54,-170l1461,546z" stroke-linecap="null" stroke-linejoin="null" stroke="#ccc" fill="#ffffff" opacity="0.3"/>\
            <path transform="rotate(172.72879028320312 1745.8424072265627,414.96813964843756) " id="svg_1" d="m2503.34229,687.96814l-1472.99988,-154l-41.99994,-222l53.99994,-170l1460.99988,546z" stroke-linecap="null" stroke-linejoin="null" stroke="#ddc" fill="#fffffd" opacity="0.3"/>\
            <path id="svg_2" transform="rotate(-101.70542907714844 846.4686279296875,1037.578369140625) " d="m1603.96851,1310.57837l-1472.99989,-154l-41.99992,-222.00006l53.99992,-170l1460.99989,546.00006z" stroke-linecap="null" stroke-linejoin="null" stroke="#ccc" fill="#fffffd"  opacity="0.3"/>\
            <path id="svg_3" transform="rotate(79.62128448486328 1092.3167724609377,-554.5372314453126) " d="m1849.81665,-281.53723l-1472.99991,-154l-41.99994,-222.00006l53.99994,-170l1460.99991,546.00006z" stroke-linecap="null" stroke-linejoin="null" stroke="#ccc" fill="#fffffd"  opacity="0.3"/>\
            <path id="svg_4" transform="rotate(-48.25798416137695 323.6652526855468,688.0607299804688) " d="m1081.16516,864.6391l-1472.99988,-99.60828l-41.99994,-143.59119l53.99994,-109.95721l1460.99988,353.15668z" stroke-linecap="null" stroke-linejoin="null" stroke="#ccc" fill="#fffffd"  opacity="0.2"/>\
            <path id="svg_5" transform="rotate(132.63966369628906 1603.656494140625,-197.8902587890625) " d="m2361.15649,-21.31193l-1472.99994,-99.60828l-41.99994,-143.59118l53.99994,-109.95721l1460.99994,353.15667z" stroke-linecap="null" stroke-linejoin="null" stroke="#ccc" fill="#fffffd"  opacity="0.2"/>\
            <animateTransform attributeName="transform" attributeType="XML"\
                      type="rotate"\
                      from="0 960 240" to="360 960 240"\
                      begin="0s" dur="120s"\
                      fill="freeze"\
                      repeatCount="indefinite"/>\
        </g>\
        <g>\
          <rect x="0" y="480" width="1920" height="1000" fill="url(#svg_18)" />\
        </g>'
        }}>
      </svg>
    );
  }
});

module.exports = SvgAnimatedBackground;
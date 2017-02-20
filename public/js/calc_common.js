/*! calc.common - v1.0.0 - 2016-01-01
 * dktechin a11y
 */
var doc = document,
    html = doc.getElementsByTagName("html")[0];
var $ = function() {
    return doc.getElementById(arguments[0]);
};

NumberValidator = (function() {
    var preQuery = "";

    function keydownHandler(e) {
        var theEvent = e || window.event,
            target = theEvent.target || theEvent.srcElement,
            key = theEvent.keyCode || theEvent.which;
        if (key == 229) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    function keypressHandler(e) {
        var theEvent = e || window.event,
            key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[0-9]|\,|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    function keyupHandler(e) {
        var theEvent = e || window.event,
            target = theEvent.target || theEvent.srcElement;
        if (preQuery != target.value) {
            preQuery = target.value;
            target.value = insertComma(target.value.replace(/,/gi, ""));
        }
    }

    function changeHandler(e) {
        var theEvent = e || window.event,
            target = theEvent.target || theEvent.srcElement;
        if (preQuery.length > target.value.length) {
            preQuery = target.value;
            target.value = insertComma(target.value.replace(/,/gi, ""));
        }
    }

    function insertComma(n) {
        var reg = /(^[+-]?\d+)(\d{3})/;
        n += '';
        while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
        return n;
    }

    return {
        initialize: function(e) {
            var elements = doc.getElementsByClassName("number_validation");
            for (var i in elements) {
                if (elements[i].addEventListener) {
                    elements[i].addEventListener("keydown", keydownHandler, false);
                    elements[i].addEventListener("keypress", keypressHandler, false);
                    elements[i].addEventListener("keyup", keyupHandler, false);
                    elements[i].addEventListener("input", changeHandler, false);
                }
            }
        },
        insertComma: function(n) {
            return insertComma(n);
        }
    };
})();

function calc_01() {
    var before = $("calc_inp_01"),
        after = $("calc_inp_02");
    var before_value = parseInt(before.value.replaceAll(",", ""));
    var after_value = parseInt(after.value.replaceAll(",", ""));
    if (before.value == "") {
        alert("전년 입력필드에 값을 입력해주세요.");
        before.focus();
        return false;
    }
    if (after.value == "") {
        alert("올해 입력필드에 값을 입력해주세요.");
        after.focus();
        return false;
    }
    var result_value = ((after_value - before_value) / before_value) * 100;


    var output = '<div class="info_calc"><span class="tit_base">전년 대비</span>';
    output += '<span class="txt_num"><em class="txt_emph">' + result_value.toFixed(1) + '</em><span class="txt_unit">&nbsp;%</span></span></div>';
    $("msg_01").innerHTML = output;
    $("msg_01").style.display = "block";
};

function calc_02() {
    var basis = $("calc_inp_03"),
        basis_value = parseInt(basis.value.replaceAll(",", ""));
    if (basis.value == "") {
        alert("기준연봉 입력필드에 값을 입력해주세요.");
        basis.focus();
        return false;
    }

    function conv_cost(cost, rate) {
        var out_value = ((cost * (100 + rate)) / 100).toFixed(0);
        return out_value;
    }
    var rate = new Array();
    var rate_cost = new Array();
    for (var i = 1; i < 7; i++) {
        rate[i] = 2.5 * i;
        rate_cost[i] = conv_cost(basis_value, rate[i]);
    }

    var output = '<table><caption class="screen_out">기준연봉대비 구간예상</caption>';
    output += '<thead><tr><th>인상율</th><th>예상 금액</th></tr></thead>';
    for (var i = 1; i < 7; i++) {
        output += '<tbody><tr><td>' + rate[i] + '%</td><td>' + NumberValidator.insertComma(rate_cost[i]) + ' 원</td></tr>';
    }
    output += '</tbody></table>';
    $("msg_02").innerHTML = output;
    $("msg_02").style.display = "block";
};

function calc_03() {
    var basis = $("calc_inp_04"),
        basis_value = parseInt(basis.value.replaceAll(",", ""));
    var month = $("calc_inp_05"),
        month_value = parseInt(month.value.replaceAll(",", ""));
    if (basis.value == "") {
        alert("시작 연봉 입력필드에 값을 입력해주세요.");
        basis.focus();
        return false;
    }
    if (month.value == "") {
        alert("근무 개월 입력필드에 값을 입력해주세요.");
        month.focus();
        return false;
    }
    if (month.value < 7 || month.value > 24) {
        alert("7~23개월 사이로 입력해주세요.");
        month.focus();
        return false;
    }

    function conv_cost(cost, rate) {
        var out_value = ((cost * (100 + rate)) / 100).toFixed(0);
        return out_value;
    }
    var rate = new Array(),
        rate_corr = new Array(),
        rate_cost = new Array();
    for (var i = 1; i < 7; i++) {
        rate[i] = 2.5 * i;
        rate_cost[i] = conv_cost(basis_value, rate[i]);
        rate_corr[i] = (((((rate_cost[i] - basis_value) / month_value) * 12) / basis_value) * 100).toFixed(2);
    }

    var output = '<table><caption class="screen_out">기준연봉대비 구간예상</caption>';
    output += '<thead><tr><th>인상율</th><th>보정</th><th>예상 금액</th></tr></thead>';
    for (var i = 1; i < 7; i++) {
        output += '<tbody><tr><td>' + rate[i] + '%</td><td>' + rate_corr[i] + '%</td><td>' + NumberValidator.insertComma(rate_cost[i]) + ' 원</td></tr>';
    }
    output += '</tbody></table>';
    $("msg_03").innerHTML = output;
    $("msg_03").style.display = "block";
};

function calc_04() {
    var basis = $("calc_inp_06"),
        basis_value = parseInt(basis.value.replaceAll(",", ""));
    var percent = $("calc_inp_07"),
        percent_value = parseFloat(percent.value.replaceAll(",", ""));
    if (basis.value == "") {
        alert("기준 연봉 입력필드에 값을 입력해주세요.");
        basis.focus();
        return false;
    }
    if (percent.value == "") {
        alert("평균 인상율 입력필드에 값을 입력해주세요.");
        percent.focus();
        return false;
    }

    function conv_cost(cost, percents) {
        var out_value = ((cost * (100 + percents)) / 100).toFixed(0);
        return out_value;
    }

    var tax_rate = 0.085;

    function conv_after_cost(cost) {
        var out_value = ((cost / 12) * (1 - tax_rate)).toFixed(0);
        return out_value;
    }
    var year = new Array();
    var month = new Array();

    year[0] = basis_value;
    month[0] = conv_after_cost(year[0]);

    for (var i = 1; i < 10; i++) {
        year[i] = conv_cost(year[i - 1], percent_value);
        month[i] = conv_after_cost(year[i]);
    }

    var output = '<table><caption class="screen_out">예상연봉 결과표</caption>';
    output += '<thead><tr><th>년도</th><th>예상 연봉</th><th>예상 월급 (세후)</th></tr></thead><tbody>';
    output += '<tr><td>0</td><td>' + NumberValidator.insertComma(year[0]) + '원</td><td>' + NumberValidator.insertComma(month[0]) + '원</td></tr>';
    for (var i = 1; i < 10; i++) {
        output += '<tr><td>+' + i + '</td><td>' + NumberValidator.insertComma(year[i]) + '원</td><td>' + NumberValidator.insertComma(month[i]) + '원</td></tr>';
    }
    output += '</tbody></table>';
    output += '<p class="info">기준 : 1인가구 평균 세금이 ' + (tax_rate * 100).toFixed(1) + '% 내외라고 합니다.<br>간단한 공식에 의한 예상 결과로 실제 지급액과는 다를 수 있습니다.</p>';
    $("msg_04").innerHTML = output;
    $("msg_04").style.display = "block";
};

function calc_05() {
    var before = $("calc_inp_08"),
        before_value = parseInt(before.value.replaceAll(",", ""));
    var after = $("calc_inp_09"),
        after_value = parseInt(after.value.replaceAll(",", ""));
    var month = $("calc_inp_10"),
        month_value = parseInt(month.value.replaceAll(",", ""));
    if (before.value == "") {
        alert("기준 연봉 입력필드에 값을 입력해주세요.");
        before.focus();
        return false;
    }
    if (after.value == "") {
        alert("예상 연봉 입력필드에 값을 입력해주세요.");
        after.focus();
        return false;
    }
    if (month.value == "") {
        alert("근무 개월 입력필드에 값을 입력해주세요.");
        month.focus();
        return false;
    }
    if (month.value < 7 || month.value > 24) {
        alert("7~23개월 사이로 입력해주세요.");
        month.focus();
        return false;
    }

    var ra_cost = ((after_value - before_value) / before_value) * 100;
    var cy_cost = ((((after_value - before_value) / month_value) * 12) / before_value) * 100;

    var output = '<div class="info_calc"><span class="tit_base">예상 인상율 (보정 인상율)</span>';
    output += '<span class="txt_num"><em class="txt_emph">' + ra_cost.toFixed(2) + ' (' + cy_cost.toFixed(2) + ')</em><span class="txt_unit">&nbsp;%</span></span></div>';

    $("msg_05").innerHTML = output;
    $("msg_05").style.display = "block";
};

$("btn_01").addEventListener("click", calc_01);
$("btn_02").addEventListener("click", calc_02);
$("btn_03").addEventListener("click", calc_03);
$("btn_04").addEventListener("click", calc_04);
$("btn_05").addEventListener("click", calc_05);
(function($) {
    NumberValidator.initialize("calculatorColl");
})();

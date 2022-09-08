import React, { Component } from 'react'
import "./BaiTapCalculator.css"

export default class BaiTapCalculator extends Component {
    state = {
        result: ""
    }

    // Số và phép toán sẽ đưa vào queue khi nhập toán tử +,-,*,/
    // vd: nhập 324+56 --> queue: [324,"+"]
    // input sẽ được reset là input = 56
    queue=[];
    // chứa toàn bộ số khi nhập, sẽ bị ngắt và đưa vào queue khi nhập toán tử +,-,*,/
    // vd:nhập 3245+ --> input= 03245
    input=0; 

    calculateQueue= (value) =>{
        if (this.input !== 0) {
            this.input = parseFloat(this.input);
    
            this.addToQueue(this.input);
        }
        var answer = value[0];
        var dividedByZero = 0;
        for (var i = 2; i < value.length; i = i + 2) {
    
            switch (this.queue[i - 1]) {
                case '+':
                    answer += value[i];
                    break;
                case '-':
                    answer -= value[i];
                    break;
                case '/': if (value[i] === 0) dividedByZero = 1;
                else answer = answer / value[i];
                    break;
                case '*': answer = answer * value[i];
                    break;
                default:
            }
    
        }
    
        answer = answer.toFixed(10);
        answer = parseFloat(answer);
        if (dividedByZero === 1) {
            this.clearAll();
            this.inputChangedHandler("ERROR");
        }
        else {
            this.inputChangedHandler(answer.toString());
            this.input = answer;
            this.queue = [];
        }
    }


    addToQueue=(input) =>{
        this.queue.push(input);
    }
    
    clearAll=() =>{
        this.queue = [];
        this.input = 0;
        this.inputChangedHandler("");;
    }

    numericButton=(e) =>{
        let value = e.target.name;
        let screenValue=document.getElementById("answer").getAttribute("value");
        // Nếu error hoặc màn hình đang hiển thị "" --> reset màn hình thành rỗng
        if (screenValue === "ERROR" || (screenValue === "" && value !== "."))
        {
            this.inputChangedHandler("");
        }
    
        // Khi màn hình rỗng, ta kiểm tra input nhập vào có phải là số đồng thời kiểm tra ký tự vừa nhập trước input
        // nếu là dấu . thì không cho phép nhập ( vì .. --> vô lý) --> Nếu đúng thì hiển thị
        if (!(value === ".") || !this.input.toString().match(/[.]/)) {
            this.input += value;
            let resultClick = this.state.result.concat(value);
            this.inputChangedHandler(resultClick);
        }
    }
    
    
    operatorButton=(e) => {
        let value= e.target.name;
        if (this.input !== 0 && this.input !== "-") {
            this.input = parseFloat(this.input);
            this.addToQueue(this.input);
            this.addToQueue(value);
            let resultClick = this.state.result.concat(value);
            this.inputChangedHandler(resultClick);
            this.input = 0;
    
        }
        // Trường hợp lần đầu nhập là số âm, nên phải thêm dấu - ở đằng trước
        if (value === "-" && isNaN(this.queue[0]) && this.input !== "-") {
            this.input = "-";
            this.inputChangedHandler("-");
        }
    }


    inputChangedHandler = (resultAfterClick) => {
        this.setState({
            result:resultAfterClick 
        });
    }

    backspace = () => {
        // Input ở dạng Number nên phải chuyển về string
        this.input = this.input.toString();
        // lấy kí tự bị xóa
        let lastDeletedCharacter= this.state.result.slice(-1);
        console.log("lastChar: ",lastDeletedCharacter)
        // lấy toàn bộ kí tự còn lại của chuỗi
        let resultClick = this.state.result.slice(0, -1);
        console.log("state: ",resultClick)

        // lấy kí tự cuối cùng của input
        let lastElementInput = this.input.slice(-1);
        console.log("lastIn: ",lastElementInput)
        
        // Trường hợp đặc biệt: Khi in ra kết quả result xong rồi lại xóa kết quả result
        // vd: 3 --> xóa 3 --> [] --> Nhập 1 + 3 sẽ bị lỗi vì lúc này input vẫn lưu kết quả result là 3
        // Cần reset input = 0 là chỉ số mặc định
        if(this.input.length === 1 && this.input!=="0"){
            this.input= Number("0")
            //this.queue = []
        }
        // Trường hợp 1: nhập số + số
        // so sánh độ dài input liệu có > 1 vì mặc định input là 0
        // đồng thời kiểm tra ký tự cuối input có bằng ký tự cuối bị xóa
        // vd: input = "0323" result="323" --> xóa kí tự cuối 3 
        else if(this.input.length >1 && lastElementInput === lastDeletedCharacter){
            this.input = this.input.slice(0,-1);
        }
        // Trường hợp 2: nhập số + ký tự phép toán
        // vi du: Truong hop da nhap so + phep toan: "32+"
        // Xoa dau "+" con lai "32" tuy nhien do khi nhap dau "+"
        // input duoc luu la 0 va queue hien tai la '[32,"+"]'
        else if(this.input === 0 && resultClick!=="0"){
            // reset queue ve []
            this.queue=[]
            // Vi resultClick la dang string : "023" nen phai chuyen thanh dang so Number
            this.input = Number(resultClick)
        } 
        this.inputChangedHandler(resultClick);
        
    }

    render() {
        return (
            <div className="container">
                <form>
                    <input id="answer" type="text" value={this.state.result} onChange={(event) => this.inputChangedHandler(event)} />
                </form>

                <div className="keypad">
                    <button className="highlight" onClick={this.clearAll} id="clear">Clear</button>
                    <button className="highlight" onClick={this.backspace} id="backspace">CE</button>
                    <button className="highlight" name="/" onClick={this.operatorButton}>&divide;</button>
                    <button name="7" onClick={this.numericButton}>7</button>
                    <button name="8" onClick={this.numericButton}>8</button>
                    <button name="9" onClick={this.numericButton}>9</button>
                    <button className="highlight" name="*" onClick={this.operatorButton}>&times;</button>
                    <button name="4" onClick={this.numericButton}>4</button>
                    <button name="5" onClick={this.numericButton}>5</button>
                    <button name="6" onClick={this.numericButton}>6</button>
                    <button className="highlight" name="-" onClick={this.operatorButton}>&ndash;</button>
                    <button name="1" onClick={this.numericButton}>1</button>
                    <button name="2" onClick={this.numericButton}>2</button>
                    <button name="3" onClick={this.numericButton}>3</button>
                    <button className="highlight" name="+" onClick={this.operatorButton}>+</button>
                    <button name="0" onClick={this.numericButton}>0</button>
                    <button name="." onClick={this.numericButton}>.</button>
                    <button className="highlight" onClick={()=>{this.calculateQueue(this.queue)}} id="result">=</button>
                </div>
            </div>
        )
    }
}

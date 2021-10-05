<!-- 해야할일 
1.AI Cashier 화면에서 입력받은 빵 값을 영수증으로 호출
2.값을 받을때 body 부분에 어떻게 추가가 되나? -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>bakery receipt</title>
    <style>
        body {
            margin-left: 32%;
            border:1px solid rgb(29, 29, 29);
            width: 330px;
            height: 450px;
            padding: 40px;
            text-align: center;
        }
        #table { 
            display:table; 
            width:100%; 
            border:1px solid white; 
            text-align: center;
        } 
        .row {
            display:table-row;
        } 
        .cell { 
            display:table-cell; 
            padding:1px; 
            border-bottom:1px solid white; 
            border-right:1px solid white; 
        } 
        .col {
            width:30%;
        }
    </style>
    <!-- 이거를 breadTest에 추가하면 하단에 영수증 출력 버튼이 만들어짐..
        <script>
        function newPage() {window.open('file:///C:/Users/LGUser1/Desktop/bbangzip-alphago-main%20(6)/bbangzip-alphago-main/Receipt.html');}
    </script>
    -->
</head>
<body>
    <h2>DIT 베이커리 영수증</h2>
    부산진구 양정동 양지로 54<br>
    <script>
        let today = new Date();

        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let date = today.getDate();

        document.write(year + '/' + month + '/' + date) 
    </script><br><br><br>

    <div id="table">
        <div class="row">
            <span class="cell col">구매내역</span>
            <span class="cell col">식빵</span>
            <span class="cell col">2</span> 
            <span class="cell col">2000</span> 
        </div> 
    </div>
    product <?php echo $_REQUEST['product'];?>
    ===============================
    <div id="table">
        <div class="row">
            <span class="cell col">합계</span>
            <span class="cell col">4000</span> 
        </div> 
    </div> 
    total <?php echo $_REQUEST['total'];?>
    ===============================
    <div id="table">
        <div class="row">
            <span class="cell col"><strong>결제금액</strong></span>
            <span class="cell col"><strong>4000</strong></span>
        </div> 
    </div>    
    total <?php echo $_REQUEST['total'];?>
</body>
</html>
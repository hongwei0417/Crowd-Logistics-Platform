pragma solidity ^0.5.0;


contract Sender {
    
  event order_time(address, uint); //交易時間

  mapping(address => mapping(uint => Order)) User; //某個使用者不同時間的訂單

  constructor() public {
    
  }

  struct Order {
    uint dTime; //寄送時間
    uint service; //選擇服務
    bool isUrgent; //急件是否
    uint boxSize; //貨品大小
    string dlStart; //送貨地點
    string dlEnd; //送貨終點
    string rName; //收件人姓名
    string rContact; //收件人聯絡方式
  }

  function set_order_info(
    address sender, 
    uint _dTime,
    string memory _dlStart,
    string memory _dlEnd,
    string memory _rName,
    string memory _rContact,
    uint _service,
    bool _isUrgent,
    uint _boxSize
  ) public returns(uint){

    Order memory order = Order({
      dTime: _dTime,
      dlStart: _dlStart,
      dlEnd: _dlEnd,
      rName: _rName,
      rContact: _rContact,
      service: _service,
      isUrgent: _isUrgent,
      boxSize: _boxSize
    });

    uint time = now;

    User[sender][time] = order;
    
    emit order_time(sender, time);

    return time;
  }

  function get_order_info(address sender, uint time) public view returns(
    uint,
    string memory,
    string memory,
    string memory,
    string memory,
    uint,
    bool,
    uint
  ) {

    Order memory order = User[sender][time];

    return (
      order.dTime,
      order.dlStart,
      order.dlEnd,
      order.rName,
      order.rContact,
      order.service,
      order.isUrgent,
      order.boxSize
    );
  }

}

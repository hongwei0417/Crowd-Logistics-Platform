pragma solidity ^0.5.0;
import "./Sender.sol";


contract Transaction {
    
  Sender public Store;
  
  address[] private s; //寄送方

  mapping(address => address[]) Drivers; //一個寄送方對多個和司機

  event order_time(address, uint); //交易時間
  event get_match(address, address); //取得配對合約
  event search_drivers(address); //搜尋附近司機
  event notice_drivers(address); //通知附近司機
  
  
  constructor(address addr) public {
    Store = Sender(addr);
  }


  function start_transaction(
    address sender,  
    uint _dTime,
    string memory _dlStart,
    string memory _dlEnd,
    string memory _rName,
    string memory _rContact,
    uint _service,
    bool _isUrgent,
    uint _boxSize 
  ) public {
      
    uint time = Store.set_order_info(
      sender,
      _dTime,
      _dlStart,
      _dlEnd,
      _rName,
      _rContact,
      _service,
      _isUrgent,
      _boxSize
    );

    emit order_time(sender, time);
    emit search_drivers(sender);
    
  }
  
  function get_sender() public view returns(address[] memory) {
    return s;
  }

  function get_drivers(address sender) public view returns(address[] memory) {
    return Drivers[sender];
  }

  function push_sender(address sender) public {
    s.push(sender);
  }

  function pop_sender(uint index) public returns(address) {

    require(index < s.length);

    address sender = s[index];

    delete s[index];

    for (uint i = index; i < s.length - 1; i++) {
      s[i] = s[i + 1];
    }

    s.length--;

    return sender;
  }

  function sort_drivers(address sender, address[] memory drivers) public {
    
    /*
    這邊要增加排序的邏輯
    */
    
    Drivers[sender] = drivers;

    emit notice_drivers(sender);
  }

  function pop_driver(address sender) public returns(address) {
    require(Drivers[sender].length > 0);

    address driver = Drivers[sender][0]; //取得第一位

    delete Drivers[sender];

    return driver;
  }

  function matching() public { //配對第一位

    require(s.length > 0 || Drivers[s[0]].length > 0);

    address sender = pop_sender(0);
    address driver = pop_driver(sender);

    emit get_match(sender, driver);
  }

  function clear() public {
    delete s;
  }

  function check_matching() public returns(bool) {
    bool can_match = false;

    if (Drivers[s[0]].length > 0) {
      can_match = true;
    }
    return can_match;
  }
}
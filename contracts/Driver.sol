pragma solidity ^0.5.0;


contract Driver {
    address driver;
    uint service; //選擇服務
    string delivery_start_time; //送貨地點
    string delivery_end_time; //送貨終點
    string regular_place; //收件人姓名


    constructor(uint sv, string memory dst, string memory det, string memory rp) public {

        driver = msg.sender;

        service = sv;
        delivery_start_time = dst;
        delivery_end_time = det;
        regular_place = rp;

    }

    function get_driver_info() public view returns (uint, string memory, string memory, string memory) {
        require(msg.sender == driver, "Only driver");

        return (service, delivery_start_time, delivery_end_time, regular_place);
    }
}
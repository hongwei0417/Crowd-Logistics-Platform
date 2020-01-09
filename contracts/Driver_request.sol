pragma solidity ^0.5.0;


contract Driver_Request {

    mapping(address => Driver_info) Driver;

    struct Driver_info {
        uint service; //選擇服務
        string delivery_start_time; //送貨開始時間
        string delivery_end_time; //送貨結束時間
        string regular_place; //活動區域
    }

    // struct Available_time {
    //     string delivery_start_time; //送貨開始時間
    //     string delivery_end_time; //送貨結束時間
    // }

    // struct Driver_info {
    //     uint service; //選擇服務
    //     Available_time ats; //司機可寄送時間
    //     string regular_place; //活動區域
    // }


    function set_driver_info(uint sv, string memory dst, string memory det, string memory rp) public {

        Driver_info memory info = Driver_info({
            service: sv,
            delivery_start_time: dst,
            delivery_end_time: det,
            regular_place: rp
        });

        Driver[msg.sender] = info;

    }

    function get_driver_info() public view returns (uint, string memory, string memory, string memory) {

        Driver_info memory info = Driver[msg.sender];

        return (info.service, info.delivery_start_time, info.delivery_end_time, info.regular_place);
    }
}
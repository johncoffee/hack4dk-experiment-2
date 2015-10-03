function OldPeople() {
}
OldPeople.prototype.getData = function (callback) {
    var oldPeopleBaseURL = "//ragelse.dk/";
    var oldPeople = [
        './assets/images/16213259323_7dba16b75c_z.jpg',
        './assets/images/16443294914_32213cceff_z.jpg',
        './assets/images/16656845429_425b8305e4_z.jpg',
        './assets/images/16841568492_3684de3c87_z.jpg',
        './assets/images/16880711829_4c9a22552c_z.jpg',
        './assets/images/17066613675_1b479b849e_z.jpg',
        './assets/images/17608847822_bd9fe1c35f_z.jpg',
        './assets/images/21581261632_d0d880ac5a_z.jpg',
        './assets/images/CRW_2900.jpg',
        './assets/images/KMS3025.jpg',
        './assets/images/img0111.jpg',
        './assets/images/img0145.jpg',
        './assets/images/img0146.jpg',
        './assets/images/img0158.jpg',
        './assets/images/img0259.jpg',
        './assets/images/img0264.jpg',
        './assets/images/kms7479.jpg',
        './assets/images/tumblr_inline_nmqucnBpHF1t8luy9_500.jpg',
        './assets/images/tumblr_inline_nmqudsB1Dd1t8luy9_500.jpg',
        './assets/images/tumblr_inline_nmquj7vGhT1t8luy9_540.jpg'
    ];

    var self = this;
    setTimeout(function () {
        self.data = oldPeople.map(function (item) {
            return {
                url: oldPeopleBaseURL + item,
            };
        });
        callback(self.data);
    }, 0);
    
};
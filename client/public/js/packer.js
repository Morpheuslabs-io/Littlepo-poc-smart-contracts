$(document).ready(function(){
    let scanner = new Instascan.Scanner({ 
        video: document.getElementById('preview') 
    });
    scanner.addListener('scan', function (content) {
        // query information from blockchain
        $("#qrCodeId").val(content);
        scanner.stop();
    });
    $("#scan").click(()=> {
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
            } else {
                console.error('No cameras found.');
            }
        }).catch(function (e) {
            console.error(e);
        });
    });

    // $("#submit").click(function(event) {
    //     event.preventDefault();
    //     let qrCodeId = $("#qrCodeId").val();

    //     let url = "/packer/addpackage?qrCodeid="+qrCodeId;
    //     window.location.href = url;
    // });
});
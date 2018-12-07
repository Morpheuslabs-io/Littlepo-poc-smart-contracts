$(document).ready(function(){
    $("#productId" ).selectmenu();
    $("#packageType" ).selectmenu();
    $("#speed" ).selectmenu();
    // applySelectBoxType("productId");
    // applySelectBoxType("packageType");

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
});
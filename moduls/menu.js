class Menu extends PluginBase {

    constructor(scene, camera) {
        super();

        /* */
        var adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // var masterpanel = new BABYLON.GUI.StackPanel();
        // masterpanel.thickness = 3;
        // adt.addControl(masterpanel);

        // var dialogRect = new BABYLON.GUI.Rectangle();
        // dialogRect.width = 0.9;
        // dialogRect.height = .5;
        // // dialogRect.cornerRadius = cellCorner;
        // dialogRect.color = "white";
        // dialogRect.thickness = 2;
        //adt.addControl(dialogRect);

        var headerRect = new BABYLON.GUI.Rectangle();
        headerRect.width = 0.9;
        headerRect.height = 0.05;
        headerRect.top = 10;
        // headerRect.paddingTop = 5;
        // headerRect.cornerRadius = 10;
        headerRect.color = "white";
        headerRect.thickness = 2;
        headerRect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        // var headerText = new BABYLON.GUI.TextBlock();
        // headerText.text = "Cruise Control";
        // headerText.color = "white";
        // headerText.fontSize = 35;
        // headerRect.addControl(headerText);
        // dialogRect.addControl(headerRect);
        adt.addControl(headerRect);


        // var contentRect = new BABYLON.GUI.Rectangle();
        // contentRect.width = 1;
        // contentRect.height = .8;
        // // contentRect.cornerRadius = 10;
        // // contentRect.paddingLeft = -150; // yikes
        // contentRect.paddingLeft = 5;
        // // contentRect.paddingTop = 40;
        // contentRect.paddingRight = 5;
        // contentRect.paddingBottom = 5;
        // contentRect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

        // contentRect.color = "white";
        // contentRect.thickness = 2;
        // dialogRect.addControl(contentRect);
        // adt.addControl(contentRect);

        // just two side-by-side controls... the contentRect and the sliderRect
        // var contentPanel = new BABYLON.GUI.StackPanel();
        // contentPanel.isVertical = false;
        // contentPanel.paddingLeft = "10px"; // yikes
        // contentPanel.paddingRight = "10px"; // yikes
        // contentRect.addControl(contentPanel);

        // var listRect = new BABYLON.GUI.Rectangle();
        // listRect.width = .95;
        // listRect.height = 1.0;
        // // listRect.cornerRadius = 10;
        // // listRect.paddingLeft = -150; // yikes
        // listRect.paddingLeft = 10;
        // listRect.paddingTop = 10;
        // listRect.paddingRight = 10;
        // listRect.paddingBottom = 10;
        // listRect.color = "green";
        // listRect.thickness = 4;


        // var sliderRect = new BABYLON.GUI.Rectangle();
        // sliderRect.width = .03;
        // sliderRect.height = .95;
        // // listRect.cornerRadius = 10;

        // listRect.paddingLeft = -150; // yikes

        // sliderRect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        // sliderRect.paddingLeft = -20;  // yikes
        // sliderRect.paddingTop = 0;
        // sliderRect.paddingRight = 0;
        // sliderRect.paddingBottom = 0;
        // sliderRect.color = "blue";
        // sliderRect.thickness = 4;

        // var slider = new BABYLON.GUI.Slider();
        // // console.log("slider: ", slider);
        // // slider.minimum = 0;
        // // slider.maximum = 10;
        // // rowIndex = 7;
        // // slider.paddingLeft = "10px"; // yikes
        // // slider.paddingRight = "50px";
        // slider.paddingLeft = 0;
        // // slider.top = "12px";
        // slider.height = .07;
        // slider.width = 10.2;  // yikes
        // // slider.left = -125;
        // // slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        // // slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        // slider.onValueChangedObservable.add(function (value) {
        //     window.display(Math.round(value), count);

        //     // header.text = "Y-rotation: " + (BABYLON.Tools.ToDegrees(value) | 0) + " deg";
        //     // if (skull) {
        //     //     skull.rotation.y = value;
        //     // }
        // });
        // slider.rotation = Math.PI / 2;
        // sliderRect.addControl(slider);

        // var listPanel = new BABYLON.GUI.StackPanel();
        // // listPanel.paddingLeft = 10;
        // listPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        // // listPanel.left = "20px";
        // // listPanel.isVertical = false;
        // // listPanel.background = "red";
        // listPanel.paddingLeft = 0;
        // listPanel.paddingTop = 0;
        // listPanel.paddingRight = 0;
        // listPanel.paddingBottom = 0;


        var button1 = BABYLON.GUI.Button.CreateSimpleButton("home", "home");
        button1.top = "0px";
        button1.left = "-150px";
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "black";
        // button1.cornerRadius = 20;
        button1.background = "white";
        button1.onPointerUpObservable.add(function () {
            alert("home");
        });
        headerRect.addControl(button1);


        var button1 = BABYLON.GUI.Button.CreateSimpleButton("prev", "prev");
        button1.top = "0px";
        button1.left = "0px";
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "black";
        // button1.cornerRadius = 20;
        button1.background = "white";
        button1.onPointerUpObservable.add(function () {
            alert("prev");
        });
        headerRect.addControl(button1);


        var button1 = BABYLON.GUI.Button.CreateSimpleButton("next", "next");
        button1.top = "0px";
        button1.left = "150px";
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "black";
        // button1.cornerRadius = 20;
        button1.background = "white";
        button1.onPointerUpObservable.add(function () {
            alert("next");
        });
        headerRect.addControl(button1);


        /* */

        // var manager = new BABYLON.GUI.GUI3DManager(scene);
        // var panel = new BABYLON.GUI.StackPanel3D();
        // panel.margin = 0.02;

        // manager.addControl(panel);
        // panel.position.z = -1.5;

        // var addButton = function (title, callback) {
        //     var button = new BABYLON.GUI.Button3D("orientation");
        //     panel.addControl(button);
        //     button.onPointerUpObservable.add(function () {
        //         // panel.isVertical = !panel.isVertical;
        //         callback();
        //     });

        //     var text1 = new BABYLON.GUI.TextBlock();
        //     text1.text = title;
        //     text1.color = "white";
        //     text1.fontSize = 24;
        //     button.content = text1;
        // }

        // addButton("example1", () => { alert("example1") });
        // addButton("example2", () => { alert("example2") });



        // // Create the 3D UI manager
        // var manager = new BABYLON.GUI.GUI3DManager(scene);

        // // Create a horizontal stack panel
        // var panel = new BABYLON.GUI.StackPanel3D();
        // // panel.margin = 0.02;
        // // panel.position.z = -40;
        // manager.addControl(panel);



        // // Let's add some buttons!
        // var addButton = function () {
        //     var button = new BABYLON.GUI.Button3D("orientation");
        //     panel.addControl(button);
        //     button.onPointerUpObservable.add(function () {
        //         panel.isVertical = !panel.isVertical;
        //     });

        //     var text1 = new BABYLON.GUI.TextBlock();
        //     text1.text = "change orientation";
        //     text1.color = "white";
        //     text1.fontSize = 24;
        //     button.content = text1;
        // }

        // addButton();
        // addButton();
        // addButton();

    }

    update() { }
    activate() { }
    deactivate() { }
}
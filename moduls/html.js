class Html extends PluginBase {

    constructor(scene) {
        super();


        // https://www.babylonjs-playground.com/#Y2LIXI#19

        // Some random shapes
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
        var box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
        var bg = BABYLON.MeshBuilder.CreatePlane("bg", { width: 1, height: 1 }, scene);

        // A disc we will use to test masking pointer events.  Note this disc
        // will only be pickable if the pointer enters it without passing
        // over the html mesh, or if it is masked.
        var disc = BABYLON.MeshBuilder.CreateDisc("disc", { radius: 0.5 })

        bg.scaling.x = 12;
        bg.scaling.y = 16
        bg.position.z = 2

        sphere.position.x = 1.5;
        sphere.position.y = -0.5;
        sphere.position.z = 1.1;
        box.position.x = -3;
        box.position.y = 1;
        box.position.z = -2;
        disc.position.x = 1.7;
        disc.position.y = -2.6;
        disc.position.z = -1.1;

        // Add action manager to box so it can receive pointer events
        box.actionManager = new BABYLON.ActionManager(scene);
        box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger, (ev) => {
                console.log("pointer over box");
            }));

        // Add action manager to disc so it can receive pointer events
        disc.actionManager = new BABYLON.ActionManager(scene);
        disc.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger, (ev) => {
                console.log("pointer over disc");
            }));

        // htmlMeshScript.onload = (event) => {
        //     console.log("babylon-htmlmesh loaded");
        //     createHtmlMeshInstances(scene);
        // };

        this.scene = scene;

    }


    createHtmlMeshInstances = (scene) => {
        const htmlMeshPackage = window["babylon-htmlmesh"];
        const HtmlMesh = htmlMeshPackage.HtmlMesh;
        const HtmlMeshRenderer = htmlMeshPackage.HtmlMeshRenderer;

        // Create the HtmlMeshRenderer
        const htmlMeshRenderer = new HtmlMeshRenderer(scene);

        // Shows how this can be used to include html content, such
        // as a form, in your scene.  This can be used to create
        // richer UIs than can be created with the standard Babylon
        // UI control, albeit with the restriction that such UIs would
        // not display in native mobile apps or XR applications.
        const htmlMeshDiv = new HtmlMesh(scene, "html-mesh-div");
        const div = document.createElement('div');
        div.innerHTML = `
        <form style="padding: 10px; transform-origin: 0 0;">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required><br><br>
            
            <label for="country">Country:</label>
            <select id="country" name="country">
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Australia">Australia</option>
            </select><br><br>
            
            <label for="hobbies">Hobbies:</label><br>
            <input type="checkbox" id="hobby1" name="hobbies" value="Reading">
            <label for="hobby1">Reading</label><br>
            <input type="checkbox" id="hobby2" name="hobbies" value="Gaming">
            <label for="hobby2">Gaming</label><br>
            <input type="checkbox" id="hobby3" name="hobbies" value="Sports">
            <label for="hobby3">Sports</label><br><br>
        </form>
    `;
        div.style.backgroundColor = 'white';
        div.style.width = '480px';
        div.style.height = '360px';
        // Style the form

        htmlMeshDiv.setContent(div, 4, 3);
        htmlMeshDiv.position.x = -3;
        htmlMeshDiv.position.y = 2;

        // Shows how this can be used to include a PDF in your scene.  Note this is 
        // conceptual only.  Displaying a PDF like this works, but any links in the
        // PDF will navigate the current tab, which is probably not what you want.
        // There are other solutions out there such as PDF.js that may give you more
        // control, but ultimately proper display of PDFs is not within the scope of
        // this project.
        const pdfUrl = 'https://cdn.glitch.com/3da1885b-3463-4252-8ded-723332b5de34%2FNew_Horizons.pdf#zoom=200?v=1599831745689'
        const htmlMeshPdf = new HtmlMesh(scene, "html-mesh-pdf");
        const iframePdf = document.createElement('iframe');
        iframePdf.src = pdfUrl;
        iframePdf.width = '480px';
        iframePdf.height = '360px';
        htmlMeshPdf.setContent(iframePdf, 4, 3);
        htmlMeshPdf.position.x = 3;
        htmlMeshPdf.position.y = 2;

        // Shows how this can be used to include a website in your scene
        const siteUrl = 'https://www.babylonjs.com/';
        const htmlMeshSite = new HtmlMesh(scene, "html-mesh-site");
        const iframeSite = document.createElement('iframe');
        iframeSite.src = siteUrl;
        iframeSite.width = '480px';
        iframeSite.height = '360px';
        htmlMeshSite.setContent(iframeSite, 4, 3);
        htmlMeshSite.position.x = -3;
        htmlMeshSite.position.y = -2;
        htmlMeshSite.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        // Shows how to create a simi transparent html on the canvas

        const topTransparentMesh = new HtmlMesh(scene, "top-transparent-html-mesh-div", { top: true });
        topTransparentMesh.billboardMode = 7
        const topTransparentMeshDiv = document.createElement('div');
        topTransparentMeshDiv.innerHTML = `Top Transparent`;
        topTransparentMeshDiv.style.backgroundColor = 'rgba(0,255,0,0.49)';
        topTransparentMeshDiv.style.width = '120px';
        topTransparentMeshDiv.style.height = '90px';
        topTransparentMeshDiv.style.display = 'flex';
        topTransparentMeshDiv.style.alignItems = 'center';
        topTransparentMeshDiv.style.justifyContent = 'center';
        // Style the form

        topTransparentMesh.setContent(topTransparentMeshDiv, 4, 3);
        topTransparentMesh.position.x = 0;
        topTransparentMesh.position.y = 2;

        // Shows how this can be used to include a YouTube video in your scene
        const videoId = 'zELYw2qEUjI';
        const videoUrl = ['https://www.youtube.com/embed/', videoId, '?rel=0&enablejsapi=1&disablekb=1&controls=0&fs=0&modestbranding=1'].join('');
        const htmlMeshVideo = new HtmlMesh(scene, "html-mesh-video");
        const iframeVideo = document.createElement('iframe');
        iframeVideo.src = videoUrl;
        iframeVideo.width = '480px';
        iframeVideo.height = '360px';
        htmlMeshVideo.setContent(iframeVideo, 4, 3);
        htmlMeshVideo.position.x = 3;
        htmlMeshVideo.position.y = -2;
    }

    activate() {
        this.createHtmlMeshInstances(this.scene);
    }

    deactivate() {
    }
}
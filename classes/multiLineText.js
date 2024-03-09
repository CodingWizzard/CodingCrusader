function create_MultiLineText_Material(scene, box, text, align_h, align_v, font_size) {

    if (box == null)
        return;
    if (text == null)
        return;
    if (text.length == 0)
        return;


    let vectorsWorld = box.getBoundingInfo().boundingBox.vectorsWorld;
    let box_width = Number(vectorsWorld[1].x - (vectorsWorld[0].x));
    let box_height = Number(vectorsWorld[1].y - (vectorsWorld[0].y));


    // let font_size = 14;
    let font_name = 'Arial';
    let color = 'black'
    let clearColor = 'rgba(255,255,255,255)';
    let x_offset = 5;
    let y_offset = 5;
    let font = font_size + 'px ' + font_name;

    let x = x_offset;
    let y = y_offset + font_size;

    let resolution = 100;
    let resolution_width = resolution * box_width - x_offset;
    let resolution_height = resolution * box_height - y_offset;
    let DTHeight = font_size;
    let dynamicTexture = null;
    let mat = null;

    let id = 1;

    dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture_' + id, {
        width: resolution * box_width,
        height: resolution * box_height
    }, scene);
    mat = new BABYLON.StandardMaterial('mat_' + id, scene);
    mat.diffuseTexture = dynamicTexture;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    // mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    // mat.alpha = 0.8;
    let ctx = dynamicTexture.getContext();


    let idx_line = 0;
    let lines = [];
    lines[idx_line] = [];

    let tokens = text.split(' ');
    for (let i = 0; i < tokens.length; i++) {

        // skip empty tokens
        if (tokens[i].trim().length == 0)
            continue;

        if (tokens[i] == '<br>') {
            idx_line++;
            lines[idx_line] = [];

            x = x_offset;
            y += font_size + y_offset;
            if (y >= resolution_height)
                break;
            continue;
        }

        let temp = new BABYLON.DynamicTexture('DynamicTexture_temp_' + id, {
            width: resolution * box_width,
            height: resolution * box_height
        }, scene);
        let tmpctx = temp.getContext();
        tmpctx.font = font;
        let DTWidth = tmpctx.measureText(tokens[i]).width;
        temp.dispose();

        if (x + DTWidth >= resolution_width) {
            idx_line++;
            lines[idx_line] = [];

            x = x_offset;
            y += font_size + y_offset;

            if (y >= resolution_height)
                break;
        }

        lines[idx_line].push({ word: tokens[i], w: DTWidth, x: x, y: y });

        x += DTWidth + x_offset;
    }

    let y_last = 0;
    for (let i1 = 0; i1 < lines.length; i1++) {
        if (lines[i1].length > 0)
            if (y_last < lines[i1][lines[i1].length - 1].y)
                y_last = lines[i1][lines[i1].length - 1].y;
    }


    y_offset = 0;
    if (align_v == 'center')
        y_offset = (resolution_height - y_last) / 2;
    else if (align_v == 'top')
        y_offset = 0;
    else if (align_v == 'bottom')
        y_offset = resolution_height - y_last;


    for (let i1 = 0; i1 < lines.length; i1++) {

        if (lines[i1].length <= 0)
            continue;

        let x_last = lines[i1][lines[i1].length - 1].x + lines[i1][lines[i1].length - 1].w;
        let x_offset = 0;
        if (align_h == 'center')
            x_offset = (resolution_width - x_last) / 2;
        else if (align_h == 'left')
            x_offset = 0;
        else if (align_h == 'right')
            x_offset = resolution_width - x_last;

        for (let i2 = 0; i2 < lines[i1].length; i2++) {
            dynamicTexture.drawText(lines[i1][i2].word, lines[i1][i2].x + x_offset, lines[i1][i2].y + y_offset, font, color, clearColor);
            clearColor = null;
        }
    }

    return mat;
}
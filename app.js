// SCENE SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
camera.position.set(0, 0, 2);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#e0e0e0');
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enablePan = false;

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener( 'keydown', onKeyDown, false );
window.addEventListener( 'keyup', onKeyUp, false );




var colors = {
    partition: 0x00c0c0,
    partition_points: 0xee5500,
    voronoi: 0x007700,
    voronoi_points: 0xFF88FF,
    delaunay: 0x000099,
    quad_input: 0x70FF70,
    quad_input_seeds: 0xFF00FF,
    quad_input_points: 0xFF0000,
    drawing: 0x000000,
    line_width: 1,
    points: 0xFFFFFF,
    point_size: 1
};

var showing = {
    partition: false,
    voronoi: true,
    delaunay: false,
    dual: false,
    quad_input: false,
}

var test_sets = {

    // example of test set
    test: function(){
        this.reset();
        
    },

    test0: function() {
        this.reset();
        create_branch(new THREE.Vector3(0.6022189360479403, 0.7368469495958743, 0.3072278078829223));
        create_branch(new THREE.Vector3(-0.13518906815654932, -0.5233125218963196, 0.8413488695407381));
        create_branch(new THREE.Vector3(0.6333494652638829, 0.19158420104961565, 0.7497759323678848));
        create_branch(new THREE.Vector3(0.25380677790900835, 0.8896366161154757, -0.3796430043528435));
        create_branch(new THREE.Vector3(0.27366915301936295, -0.678333516859912, -0.6818862328791571));
        create_branch(new THREE.Vector3(-0.6340194340841504, -0.05912754393972449, -0.7710533643991638));
    },

    test1: function() {
        this.reset();
        create_branch(new THREE.Vector3(-0.6276565934539953, -0.7455921050848702, 0.2239187654682791));
        create_branch(new THREE.Vector3(-0.9068306237228633, 0.3661620610516991, -0.20876677160117116));
        create_branch(new THREE.Vector3(0.4707099847884531, -0.7824444101851614, -0.40769210832495784));
        create_branch(new THREE.Vector3(0.9013270363530408, 0.17521024641139252, -0.39611985950151907));
        create_branch(new THREE.Vector3(0.4519145651677156, -0.8012036982533874, 0.3922318953047664));
        create_branch(new THREE.Vector3(0.13341186579864678, 0.43335205502405194, -0.8912952768137822));
        create_branch(new THREE.Vector3(-0.36643262283760847, -0.4609917373612048, -0.8082164010987689));
        create_branch(new THREE.Vector3(0.007125294886228978, 0.9337292036457034, 0.35790921255528585));
        create_branch(new THREE.Vector3(-0.7516533572498336, -0.026932391936045547, 0.659008252451862));
        create_branch(new THREE.Vector3(0.5113106429393773, 0.06240311465902836, 0.8571273404213477));
    },

    test2: function(){
        this.reset();
        create_branch(new THREE.Vector3(-0.5446325059499867, -0.23830022375253504, 0.8041072296790581));
        create_branch(new THREE.Vector3(0.27208922155342546, 0.3072021483268136, -0.9119179215136861));
        create_branch(new THREE.Vector3(-0.08400765405786662, -0.3138248737676877, 0.9457571901203758));
        create_branch(new THREE.Vector3(0.9901952694905226, 0.09554344694266843, -0.1019057310699702));
        create_branch(new THREE.Vector3(-0.22294551644001226, -0.7955700909899838, 0.5633502702772809));
        create_branch(new THREE.Vector3(0.02033972531629098, -0.9275590798408413, -0.3731225656253853));
        create_branch(new THREE.Vector3(0.8158780090259192, -0.5686191941655138, 0.10495373463800071));
        create_branch(new THREE.Vector3(-0.6373444184278498, -0.7537733938264358, 0.160055499931251));
    },

    test3: function(){
        this.reset();
        create_branch(new THREE.Vector3(0.3829865014217917, -0.9228871531194027, -0.04000802839256289));
        create_branch(new THREE.Vector3(-0.07821961832547511, 0.978905534304719, -0.18874757274362491));
        create_branch(new THREE.Vector3(-0.6446926142292589, 0.16253105741497545, 0.7469639138096391));
        create_branch(new THREE.Vector3(0.4000607235860555, 0.9153940402755317, 0.044779107537337305));
        create_branch(new THREE.Vector3(0.33225977560890546, 0.5431527428534877, -0.771095674636456));
        create_branch(new THREE.Vector3(-0.8635046495857541, 0.4749613630019852, -0.16962141315022947));
        create_branch(new THREE.Vector3(0.02449447590152628, -0.9974966727860739, -0.06633557440033123));
        create_branch(new THREE.Vector3(-0.5149907713028558, 0.7526818756329439, 0.4101883708329179));
    },

    test4: function(){
        this.reset();
        create_branch(new THREE.Vector3(-0.1505504059017074, 0.19948384616774073, 0.9682668900674836));
        create_branch(new THREE.Vector3(0.25711122352573157, 0.2167335245187961, 0.9417645130746655));
        create_branch(new THREE.Vector3(-0.01503532873784565, -0.9998855994122066, -0.001651356362893214));
        create_branch(new THREE.Vector3(-0.699040257749172, 0.5202698574257949, 0.49057312757642474));
        create_branch(new THREE.Vector3(-0.7715137936535212, -0.17300148284208033, 0.6122392940156617));
        create_branch(new THREE.Vector3(-0.9812648975676954, -0.1564033846426378, 0.1125041424738988));
        create_branch(new THREE.Vector3(-0.6852970902048313, 0.2216455353988245, -0.6937154710647296));
        create_branch(new THREE.Vector3(0.7681835577408109, 0.6302304693733196, 0.11271014634963177));
    },

    test5: function(){
        this.reset();
        create_branch(new THREE.Vector3(-0.4481787062356545, 0.6116008861722498, -0.6519817507494007));
        create_branch(new THREE.Vector3(-0.7370164681546367, 0.5880894888410481, -0.33310280512709595));
        create_branch(new THREE.Vector3(0.275028075314595, 0.4876225433142143, 0.8286035318778979));
        create_branch(new THREE.Vector3(0.3977630414400055, 0.5041356511167446, 0.766571463164063));
        create_branch(new THREE.Vector3(0.7905688326468046, 0.5136753080142501, -0.3333745622928269));
        create_branch(new THREE.Vector3(0.06402778587177498, -0.8198926477207042, 0.5689257322796109));
        create_branch(new THREE.Vector3(0.5251612236288106, -0.023163484412576034, -0.8506874527031411));
        create_branch(new THREE.Vector3(-0.6011923741165914, -0.014376553653484413, -0.7989749958597608));
    },

    test6: function(){
        this.reset();
        create_branch(new THREE.Vector3(-0.027196660105195617, -0.4941635043542969, -0.8689434806956108));
        create_branch(new THREE.Vector3(0.6470485462708346, 0.6707188054057627, -0.36258028468722137));
        create_branch(new THREE.Vector3(0.9726134647850051, 0.17121057048580168, 0.15719411144452652));
        create_branch(new THREE.Vector3(-0.1445106689482451, 0.9194106156356515, -0.3657878981275955));
        create_branch(new THREE.Vector3(0.2516027805814073, -0.24518563653923098, -0.9362585350417674));
        create_branch(new THREE.Vector3(0.20953955935398344, -0.005552129799063867, 0.977784407178));
        create_branch(new THREE.Vector3(-0.5006502313557405, 0.41629356342073376, -0.7589789291527869));
        create_branch(new THREE.Vector3(0.03294193124505421, -0.9960777987531586, -0.0821209351926063));
    },

    test7: function(){
        this.reset();
        create_branch(new THREE.Vector3(-0.28357616533984337, -0.9321516979690052, -0.225117237066935));
        create_branch(new THREE.Vector3(0.26789603351412383, 0.9634015329729511, -0.009444654189937462));
        create_branch(new THREE.Vector3(-0.05186307606596817, 0.42349039472251804, -0.9044147869858948));
        create_branch(new THREE.Vector3(0.6383216436907595, -0.007340228933726143, 0.7697347596640856));
        create_branch(new THREE.Vector3(-0.8931096128777963, 0.42914382863726486, -0.1348732506015281));
        create_branch(new THREE.Vector3(-0.5014265374523592, -0.6201751133910982, -0.6032862142208093));
        create_branch(new THREE.Vector3(0.920654337944993, -0.2577968099039426, 0.2931490999925082));
        create_branch(new THREE.Vector3(0.2356037243612976, -0.9200289781078299, -0.3131095088127283));
    },

    test8: function(){
        this.reset();
        create_branch(new THREE.Vector3(-0.5773460268515668, 0.7626789200850789, -0.2915346122445297));
        create_branch(new THREE.Vector3(0.6004823548690478, 0.740338243412996, 0.3021923672614556));
        create_branch(new THREE.Vector3(-0.699303031010024, 0.6927545962886952, -0.176256461274702));
        create_branch(new THREE.Vector3(-0.887021729032969, -0.07765406409631424, 0.45515085252330073));
        create_branch(new THREE.Vector3(-0.5361324329097976, -0.26296875900398214, -0.802128073421026));
        create_branch(new THREE.Vector3(0.751750334569051, -0.04217611245113154, 0.6580977207176981));
        create_branch(new THREE.Vector3(0.4850678292548788, 0.3936041472007726, 0.7808873006575996));
        create_branch(new THREE.Vector3(0.767597655264949, 0.42554630316685943, 0.47927464307302114));
    },

    test_hex: function(){
        this.reset();
        create_branch(new THREE.Vector3(-0.9215493002475541, 0.3867686065108028, -0.034013706515645205));
        create_branch(new THREE.Vector3(0.142505825093407, 0.9793834628908725, -0.14317863817737472));
        create_branch(new THREE.Vector3(-0.02855039549374546, 0.4271959509982842, 0.9037081909376634));
        create_branch(new THREE.Vector3(0.9217688506358075, -0.3770129020865927, -0.09057294109047058));
        create_branch(new THREE.Vector3(-0.13277509191658707, -0.9857401401966507, 0.10337867754825208));
        create_branch(new THREE.Vector3(0.1655108524961652, -0.46615375509007373, -0.8690839052251621));
    },

    test_oct: function(){
        this.reset()
        create_branch(new THREE.Vector3(-0.5001, 0, 0.5));
        create_branch(new THREE.Vector3(0.5, 0, 0.5001));
        create_branch(new THREE.Vector3(0, 0.5, 0.5));
        create_branch(new THREE.Vector3(0, -0.5001, 0.5));
        create_branch(new THREE.Vector3(-0.5001, 0, -0.5));
        create_branch(new THREE.Vector3(0.5, 0, -0.5001));
        create_branch(new THREE.Vector3(0, 0.5, -0.5001));
        create_branch(new THREE.Vector3(0, -0.5, -0.5));
    },

    test_trunc_oct: function(){
        this.reset()
        create_branch(new THREE.Vector3(-0.5001, 0, 0.5));
        create_branch(new THREE.Vector3(0.5, 0, 0.5001));
        create_branch(new THREE.Vector3(0, 0.5, 0.5));
        create_branch(new THREE.Vector3(0, -0.5001, 0.5));
        create_branch(new THREE.Vector3(-0.5001, 0, -0.5));
        create_branch(new THREE.Vector3(0.5, 0, -0.5001));
        create_branch(new THREE.Vector3(0, 0.5, -0.5001));
        create_branch(new THREE.Vector3(0, -0.5, -0.5));
        create_branch(new THREE.Vector3(0.5, 0.5, 0.0001));
        create_branch(new THREE.Vector3(0.5, -0.5, 0.0));
        create_branch(new THREE.Vector3(-0.5, 0.5001, -0.0001));
        create_branch(new THREE.Vector3(-0.5001, -0.5, 0.0));
    },


    test_ico: function()
    {
        this.reset();
        create_branch(new THREE.Vector3(0.0 , 0.0, 0.5));
        create_branch(new THREE.Vector3(0.447213 , 0.000000 , 0.223606));
        create_branch(new THREE.Vector3( 0.138196 , 0.425325 , 0.223606));
        create_branch(new THREE.Vector3(-0.361803 , 0.262865 , 0.223606));
        create_branch(new THREE.Vector3(-0.361803 , -0.262865,  0.223606));
        create_branch(new THREE.Vector3( 0.138196 , -0.425325,  0.223606));
        create_branch(new THREE.Vector3( 0.361803 , 0.262865 , -0.223606));
        create_branch(new THREE.Vector3(-0.138196 , 0.425325,  -0.223606));
        create_branch(new THREE.Vector3(-0.4472135 , 0.000000,  -0.223606));
        create_branch(new THREE.Vector3( -0.138196 , -0.425325,  -0.223606));
        create_branch(new THREE.Vector3(  0.361803 , -0.262865 , -0.223606));
        create_branch(new THREE.Vector3( 0.0 , 0.0 , -0.5));
    },

    nb_branches : 8,
    random: function(){
		this.reset();

        for(let i = 0; i < this.nb_branches; i++)
        {
			let a0 = 2 * Math.PI * Math.random();
			let a1 = Math.acos(2 * Math.random() - 1)
			let u = Math.cos(a1);
			let x = Math.sqrt(1 - u*u) * Math.cos(a0);
			let y = Math.sqrt(1 - u*u) * Math.sin(a0);
			let z = u;
			let v = new THREE.Vector3(x, y, z);

            create_branch(v);
        }
    },

    reset: function(){
        points = [];
        while(branch_lines.children.length) branch_lines.remove(branch_lines.children[0]);
        while(branch_points.children.length) branch_points.remove(branch_points.children[0]);
        reset_drawing();
        quad_input_frames = null;
        selector.material.visible = false;
    }
}

var quad_rotation = {
    rotation: 0,

    gizmo: undefined
}
// GUI
let gui = new dat.GUI({autoPlace: true, hideable: false});

gui.add(showing, "partition").onChange(require_update);
let folder_partition = gui.addFolder("Partition Colors");
folder_partition.addColor(colors, 'partition').onChange(require_update);
folder_partition.addColor(colors, 'partition_points').onChange(require_update);
gui.add(showing, "voronoi").onChange(require_update);

let folder_voronoi = gui.addFolder("Voronoi Colors");
folder_voronoi.addColor(colors, 'voronoi').onChange(require_update);
folder_voronoi.addColor(colors, 'voronoi_points').onChange(require_update);
gui.add(showing, "delaunay").onChange(require_update);
gui.add(showing, "dual").onChange(require_update);

let folder_delaunay = gui.addFolder("Delaunay Colors");
folder_delaunay.addColor(colors, 'delaunay').onChange(require_update);

// gui.add(showing, "quad_input").onChange(require_update);
// let folder_quad = gui.addFolder("Quad Input");
// folder_quad.addColor(colors, 'quad_input').onChange(require_update);
// folder_quad.addColor(colors, 'quad_input_seeds').onChange(require_update);
// folder_quad.addColor(colors, 'quad_input_points').onChange(require_update);

let folder_test = gui.addFolder("Tests");
let folder_test_cases = folder_test.addFolder("Cases");
folder_test_cases.add(test_sets, "test0").onChange(require_update);
folder_test_cases.add(test_sets, "test1").onChange(require_update);
folder_test_cases.add(test_sets, "test2").onChange(require_update);
folder_test_cases.add(test_sets, "test3").onChange(require_update);
folder_test_cases.add(test_sets, "test4").onChange(require_update);
folder_test_cases.add(test_sets, "test5").onChange(require_update);
folder_test_cases.add(test_sets, "test6").onChange(require_update);
folder_test_cases.add(test_sets, "test7").onChange(require_update);
folder_test_cases.add(test_sets, "test8").onChange(require_update);
folder_test_cases.add(test_sets, "test_hex").onChange(require_update);
folder_test_cases.add(test_sets, "test_oct").onChange(require_update);
folder_test_cases.add(test_sets, "test_trunc_oct").onChange(require_update);
folder_test_cases.add(test_sets, "test_ico").onChange(require_update);
folder_test.add(test_sets, "nb_branches").min(3).max(30).step(1).onChange(require_update);
folder_test.add(test_sets, "random").onChange(require_update);
gui.add(test_sets, "reset").onChange(require_update);

gui.addColor(colors, "drawing");
gui.addColor(colors, "points");
gui.add(colors, "line_width", 1, 20);
gui.add(colors, "point_size", 1, 10);

function gui_add_rotation()
{
    if(quad_rotation.gizmo)
        gui.remove(quad_rotation.gizmo)

    quad_rotation.gizmo = gui.add(quad_rotation, 'rotation', -1.5, 1.5);

    quad_rotation.gizmo.onChange(gui_handle_rotation);
}

function gui_handle_rotation()
{
    if(selected_point)
        quad_input_frame_rotations[selected_point.userData.id] = quad_rotation.rotation;
    require_update();
}

function gui_remove_rotation()
{
    if(quad_rotation.gizmo)
        gui.remove(quad_rotation.gizmo);
    quad_rotation.gizmo = null;
}

// SCENE RENDERING
function start()
{
    init_scene();
    init_drawing();
    rendering_loop();
}

var requires_update = false;
function require_update() { requires_update = true;}

function update()
{
	if(requires_update)
	{
		requires_update = false;

        update_delaunay((showing.delaunay || showing.voronoi) && points.length > 3 );
        update_voronoi(showing.voronoi && points.length > 3);

        update_iteration(showing.partition && points.length > 2);

        update_quad_input(showing.quad_input && points.length > 2);
	}
}

function render()
{
    renderer.render(scene, camera);
}

function rendering_loop()
{
    update();
    render();

    requestAnimationFrame(rendering_loop);
}

start();



// USER INPUT HANDLING
let mouse = new THREE.Vector2();
let previous_pos = new THREE.Vector3();
let current_pos = new THREE.Vector3();
let drawing0;
let drawing1;
let raycaster = new THREE.Raycaster();
let selected_point;

let keys = new Array(256);
function onKeyDown(event)
{
    keys[event.which] = true;
    switch(event.which){
        case 81: // q
            if(quad_input_map)
                rotate_frames(0.1);
            break;
        default:
            break;
    }
}

function onKeyUp(event)
{
    // console.log(event.which);
    keys[event.which] = false;
    switch(event.which){
        case 8: // backspace
            delete_last_line();
            break;
        case 68: // d
            drawing0 = null;
            drawing1 = null;
            break;
        case 78: // n
            step_voronoi_remesh();
            break;
        case 66: // b
            one_step_delaunay_remesh();
            break;
        case 82: //r
            reset_drawing()
            break;
        default:
            break;
    }
}

function onMouseMove(event)
{
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersection = raycaster.intersectObjects([sphere]);
    if(intersection.length)
    {
        current_pos.copy(intersection[0].point).normalize();
        let quat = new THREE.Quaternion();
        quat.setFromUnitVectors(previous_pos, current_pos);
        previous_pos.copy(intersection[0].point).normalize();

        selected_point.position.applyQuaternion(quat);
        selected_point.userData.branch_line.geometry.verticesNeedUpdate = true;
        selector.position.copy(selected_point.position);

        update_frame(selected_point.userData.id);
	}
	requires_update = true;
}

function onMouseUp(event)
{
    window.removeEventListener( 'mousemove', onMouseMove, false );
    window.removeEventListener( 'mouseup', onMouseUp, false );
}

function onMouseDown(event)
{
    if(event.buttons == 2)
    {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        let intersections = raycaster.intersectObjects([sphere, ...branch_points.children]);

        if(intersections.length)
        {
            if(intersections[0].object == sphere)
            {
                if(keys[65]) //a
                {
                    create_branch(intersections[0].point);
					requires_update = true;
                }
                selected_point = null;
                selector.material.visible = false;
                gui_remove_rotation();

                if(keys[68]) // d
                {
                    if(!drawing0)
                        drawing0 = intersections[0].point.clone();
                    else
                    {
                        drawing1 = intersections[0].point.clone();
                        drawing0.normalize();
                        drawing1.normalize();
                        add_drawn_line(drawing0, drawing1)
                        drawing0 = drawing1;
                    }
                }

                if(keys[80]) // p
                {
                    add_point(intersections[0].point);
                }
            }
            else
            {
                selected_point = intersections[0].object;
                selector.material.visible = true;
                selector.position.copy(intersections[0].object.position);
                previous_pos.copy(intersections[0].point).normalize();
                window.addEventListener('mousemove', onMouseMove, false)
                window.addEventListener('mouseup', onMouseUp, false);

                if(showing.quad_input)
                {
                    gui_add_rotation();
                    quad_rotation.rotation = quad_input_frame_rotations[selected_point.userData.id];
                }
            }
        }
        else
        {
            selected_point = null;
            selector.material.visible = false;
            gui_remove_rotation();
        }
    }
}







var zero = new THREE.Vector3();
var sphere;
var points;
var branch_lines;
var branch_points;
var branch_line_material = new THREE.LineBasicMaterial({linewidth: 2, color: 0x000000});
var branch_point_material = new THREE.MeshLambertMaterial({color: 0xDD0000});
var branch_point_geometry = new THREE.SphereGeometry( 0.025, 16, 16 );
var selector;
function init_scene()
{

    let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);
    let pointLight = new THREE.PointLight(0xFFEEDD, 0.3);
    pointLight.position.set(1,1,1);
    scene.add(pointLight);

    let sphere_mat = new THREE.MeshLambertMaterial({color: 0xEEEEEE, transparent: true, opacity: 0.90});
    let sphere_geom = new THREE.SphereGeometry( 0.995, 64, 64 );
    sphere = new THREE.Mesh(sphere_geom, sphere_mat);
    sphere.name = "sphere";
    scene.add(sphere);

    let center_mat = new THREE.MeshLambertMaterial({color: 0x222222});
    let center_geom = new THREE.SphereGeometry( 0.025, 32, 32 );
    let center = new THREE.Mesh(center_geom, center_mat);
    center.name = "center";
    scene.add(center);

    points = [];
    branch_lines = new THREE.Group();
    branch_lines.name = "branch_lines";
    branch_points = new THREE.Group();
    branch_points.name = "branch_points";
    scene.add(branch_lines);
    scene.add(branch_points);

    selector = new THREE.Mesh(new THREE.SphereGeometry( 0.026, 16, 16 ), new THREE.MeshLambertMaterial({color: 0x22FFFF}));
    selector.material.visible = false;
    selector.name = "selector";
    scene.add(selector);
}

function create_branch(position)
{
    let point = new THREE.Vector3();
    point.copy(position).normalize();

    let point_mesh = new THREE.Mesh(branch_point_geometry, branch_point_material);
    point_mesh.position.copy(point);
    branch_points.add(point_mesh);

    let branch_line_geometry = new THREE.Geometry();
    branch_line_geometry.vertices.push(point_mesh.position, zero);
    let branch_line = new THREE.Line(branch_line_geometry, branch_line_material)
    branch_lines.add(branch_line);

    point_mesh.userData.branch_line = branch_line;
    point_mesh.userData.id = points.length;
    points.push(point_mesh.position);

    update_frame(point_mesh.userData.id);
}

function get_geodesic(A, B, inside = false)
{
    let geodesics_line_material = new THREE.LineBasicMaterial({linewidth: 3, color: 0x000000});
    let line = new THREE.Line(new THREE.Geometry(), geodesics_line_material);
	line.geometry.vertices = new_geodesic(A, B, 100, inside);
    return line;
}








// VORONOI DIAGRAM
var delaunay_map;
var delaunay_renderer;
var voronoi_map;
var voronoi_renderer;
var showing_delaunay = true;
var showing_convexhull = false;
var showing_voronoi = true;
function create_delaunay()
{
    delaunay_map = delaunay(points);
	delaunay_renderer = Renderer_Spherical(delaunay_map);

}

function show_delaunay()
{
	showing.delaunay = true;
	delaunay_renderer.create_geodesics({color: colors.delaunay});
    scene.add(delaunay_renderer.geodesics);

    if(showing.dual) modify_delaunay();
}

function update_delaunay(on)
{
	if(delaunay_renderer)
	{
		scene.remove(delaunay_renderer.geodesics);
		scene.remove(delaunay_renderer.edges);
	}

	if(on) create_delaunay();
	if(on && showing.delaunay) show_delaunay();
}

function hide_delaunay()
{
	showing.delaunay = false;
    scene.remove(delaunay_renderer.geodesics);
}

function show_convexhull()
{
    delaunay_renderer.create_edges(0xFF00FF);
    scene.add(delaunay_renderer.edges);
}

function hide_convexhull()
{
    scene.remove(delaunay_renderer.edges);
}

function create_voronoi()
{
    voronoi_map = voronoi(delaunay_map);
	voronoi_renderer = Renderer_Spherical(voronoi_map);
}

function update_voronoi(on)
{
	if(voronoi_renderer)
	{
		scene.remove(voronoi_renderer.geodesics);
		scene.remove(voronoi_renderer.points);
		scene.remove(voronoi_renderer.curved_faces);
	}

	if(on) create_voronoi();
	if(on && showing.voronoi) show_voronoi();
}

function show_voronoi()
{
	showing_voronoi = true;
	voronoi_renderer.create_geodesics({color: colors.voronoi});
	voronoi_renderer.create_points({color: colors.voronoi_points});
    scene.add(voronoi_renderer.points);
    scene.add(voronoi_renderer.geodesics);

    test_voronoi_map();
}

function hide_voronoi()
{
	showing_voronoi = false;
	scene.remove(voronoi_renderer.geodesics);
    scene.remove(voronoi_renderer.points);
}



// ITERATIVE PARTITION
var iteration_map;
var iteration_renderer;
var showing_iteration = true;

function create_iteration()
{
	iteration_map = iterative_partition(points);
	iteration_renderer = Renderer_Spherical(iteration_map);
}

function update_iteration(on)
{
	if(iteration_renderer)
	{
		scene.remove(iteration_renderer.points);
		scene.remove(iteration_renderer.geodesics);
	}

	if(on) create_iteration();
	if(on && showing.partition) show_iteration();
}

function show_iteration()
{
	showing.iteration = true;
    iteration_renderer.create_points(colors.partition_points);
	iteration_renderer.create_geodesics({color: colors.partition});
	scene.add(iteration_renderer.points);
	scene.add(iteration_renderer.geodesics);
}

// // QUAD INPUT
var quad_input_frames;
var quad_input_frame_rotations;
var quad_input_map;
var quad_input_del_map;
var quad_input_renderer;
var quad_input_del_renderer;

function create_quad_input_frames()
{
    quad_input_frames = create_frames(points);
    quad_input_frame_rotations = new Array(quad_input_frames.length);
    for(let i = 0; i < quad_input_frames.length; ++i)
        quad_input_frame_rotations[i] = 0;
}

function update_frame(i)
{
    if(quad_input_frames)
    {
        quad_input_frames[i] = create_frame(points[i]);
        quad_input_frame_rotations[i] = 0;
    }
}

function create_quad_input()
{
    if(!quad_input_frames) create_quad_input_frames();
    let rotated_frames = [];
    for(let i = 0; i < quad_input_frames.length; ++i)
    {
        let frame = [quad_input_frames[i][0].clone(), quad_input_frames[i][1].clone()];
        frame[0].applyAxisAngle(points[i], quad_input_frame_rotations[i]);
        frame[1].applyAxisAngle(points[i], quad_input_frame_rotations[i]);
        rotated_frames.push(frame);
    }

    let quad_points = create_quads(points, rotated_frames);
    quad_input_del_map = delaunay(quad_points);
    quad_input_map = voronoi(quad_input_del_map, true);
	quad_input_renderer = Renderer_Spherical(quad_input_map);
	quad_input_del_renderer = Renderer_Spherical(quad_input_del_map);
}

function update_quad_input(on)
{
	if(quad_input_renderer)
	{
		scene.remove(quad_input_renderer.points);
		scene.remove(quad_input_del_renderer.points);
		scene.remove(quad_input_renderer.geodesics);
	}

	if(on) create_quad_input();
	if(on && showing.quad_input) show_quad_input();
}

function show_quad_input()
{
    showing.iteration = true;
    quad_input_renderer.create_points(colors.quad_input);
    quad_input_del_renderer.create_points(colors.quad_input_seeds);
	quad_input_renderer.create_geodesics(colors.quad_input_points);
	scene.add(quad_input_renderer.points);
	scene.add(quad_input_del_renderer.points);
	scene.add(quad_input_renderer.geodesics);
}

function tbd()
{
    let fe = mark_vertices_seed(quad_input_map);
    let map = quad_input_map;
    let material = new THREE.LineBasicMaterial({color:0xFFFFFF});
    let material1 = new THREE.LineBasicMaterial({color:0xFFFF00});
    let geodesics = new THREE.Group();
    const pos = map.get_attribute[map.vertex]("position");
    fe.forEach(frame => {
        frame.forEach(d => {
        let line = new THREE.Line(new THREE.Geometry(), material);
            line.geometry.vertices = new_geodesic(
                pos[map.cell[map.vertex](d)],
                pos[map.cell[map.vertex](map.phi2(d))],
                100);
            geodesics.add(line);
        });
    });

    fe.forEach(frame => {
        frame.forEach(d => {
        let line = new THREE.Line(new THREE.Geometry(), material1);
            line.geometry.vertices = new_geodesic(
                pos[map.cell[map.vertex](map.phi1(d))],
                pos[map.cell[map.vertex](map.phi2(map.phi1(d)))],
                100);
            geodesics.add(line);
            line = new THREE.Line(new THREE.Geometry(), material1);
            line.geometry.vertices = new_geodesic(
                pos[map.cell[map.vertex](map.phi1(d))],
                pos[map.cell[map.vertex](map.phi_1(map.phi2(d)))],
                100);
            geodesics.add(line);
        });
    });


    scene.add(geodesics)
}

function get_frame_rotations(map)
{
    const VERTEX = map.vertex;
    const pos = map.get_attribute[VERTEX]("position");

    let rotations = [];
    let frames = mark_vertices_seed(map);
    const vertex_colors = map.get_attribute[VERTEX]("vertex_colors");

    for(let i = 0; i < frames.length; i++)
    {
        let frame_rotation = new Array(4);
        for(let j = 0; j < 4; j++)
        {
            let A = pos[map.cell[VERTEX](map.phi1(frames[i][j]))];
            let r = 0;
            if(vertex_colors[map.cell[VERTEX](map.phi2(map.phi1(frames[i][j])))] == 2)
                r = geodesic_length(
                        A,
                        pos[map.cell[VERTEX](map.phi2(map.phi1(frames[i][j])))]
                );

            let r_ = 0;
            if(vertex_colors[map.cell[VERTEX](map.phi_1(map.phi2(frames[i][j])))] == 2)

                r_ = geodesic_length(
                    A,
                    pos[map.cell[VERTEX](map.phi_1(map.phi2(frames[i][j])))]
                );

            frame_rotation[j] = r < r_? -r_ : r;
        }
        rotations.push(frame_rotation);
    }

    return rotations;
}

function rotate_frames(dt)
{
    const map = quad_input_map;
    let rotations = get_frame_rotations(map);
    for(let i = 0; i < rotations.length; ++i)
    {
        let avg_rot = rotations[i][0] + rotations[i][1] +
            rotations[i][2] + rotations[i][3];
        quad_input_frame_rotations[i] += avg_rot * dt
    }
    update_quad_input(true);
}

function rotate_frames_iterations(n, dt)
{
    let i = 0
    while(i++ < n)
        rotate_frames(dt);
}

var hand_drawn_lines;
var last_drawn_line;
function init_drawing()
{
    hand_drawn_lines = new THREE.Group();
    hand_drawn_lines.name = "drawing";
    last_drawn_line = [];
    scene.add(hand_drawn_lines);
}

function add_drawn_line(A, B)
{
    let material = new THREE.LineBasicMaterial({linewidth: colors.line_width, color: colors.drawing});
    let line = new THREE.Line(new THREE.Geometry(), material);
    line.geometry.vertices = new_geodesic(A, B, 100);
    last_drawn_line.push(line);
    hand_drawn_lines.add(line);
}

function add_point(A)
{
    let material = new THREE.PointsMaterial({color: colors.points, size: colors.point_size / 50});
    let geometry = new THREE.Geometry();
    geometry.vertices.push(A.clone());

    let point = new THREE.Points(geometry, material);
    last_drawn_line.push(point);
    hand_drawn_lines.add(point)
}

function reset_drawing()
{
    while(hand_drawn_lines.children.length)
        hand_drawn_lines.remove(hand_drawn_lines.children[0]);
}

function delete_last_line()
{
    if(last_drawn_line.length)
        hand_drawn_lines.remove(last_drawn_line.pop());
}


var vrcf = undefined;
function test_voronoi_map()
{
    const map = voronoi_map;
    const vertex = voronoi_map.vertex;
    const edge = voronoi_map.edge;
    const face = voronoi_map.face;

    if(!map.is_embedded[edge]())
        map.set_embeddings[edge]();

    if(!map.is_embedded[face]())
        map.set_embeddings[face]();

    let edge_col = map.get_attribute[edge]("edge_color");
    if(!edge_col)
        edge_col = map.add_attribute[edge]("edge_color");

    let face_col = map.get_attribute[face]("face_color");
    if(!face_col)
        face_col = map.add_attribute[face]("face_color");

    if(voronoi_renderer.points)
        scene.remove(voronoi_renderer.points);
    
    voronoi_renderer.create_points({color: colors.voronoi_points});
    scene.add(voronoi_renderer.points);

    mark_face_degree0(voronoi_map);
    let face_degree = map.get_attribute[face]("face_degree");
    map.foreach[face](
        fd => {
            n = face_degree[map.cell[face](fd)];

            if(n < 4)
                face_col[map.cell[face](fd)] = new THREE.Color(0.7, 0, 0);
            if(n == 4)
                face_col[map.cell[face](fd)] = new THREE.Color(0, 0.7, 0);
            if(n > 4)
                face_col[map.cell[face](fd)] = new THREE.Color(0, 0, 0.7);

        });

    if(voronoi_renderer.curved_faces);
        scene.remove(voronoi_renderer.curved_faces);

    voronoi_renderer.create_curved_faces({faceColors: face_col, opacity: 0.5});
    scene.add(voronoi_renderer.curved_faces);

    map.foreach[edge](
        ed => {
            let n0 = face_degree[map.cell[face](ed)];
            let n1 = face_degree[map.cell[face](map.phi2(ed))];

            if(n0 == 4 && n1 == 4)
                edge_col[map.cell[edge](ed)] = new THREE.Color(0, 1, 0);
            if(n0 == 3 && n1 == 3)
                edge_col[map.cell[edge](ed)] = new THREE.Color(1, 0, 0);
            if(n0 > 4 && n1 > 4)
                edge_col[map.cell[edge](ed)] = new THREE.Color(0, 0, 1);
            if((n0 > 4 && n1 < 4) || (n0 < 4 && n1 > 4))
                edge_col[map.cell[edge](ed)] = new THREE.Color(1, 0, 1);
            if((n0 < 4 && n1 == 4) || (n0 == 4 && n1 < 4))
                edge_col[map.cell[edge](ed)] = new THREE.Color(1, 1, 0);
            if((n0 == 4 && n1 > 4) || (n0 > 4 && n1 == 4))
                edge_col[map.cell[edge](ed)] = new THREE.Color(0, 1, 1);
        });

    if(voronoi_renderer.geodesics)
        scene.remove(voronoi_renderer.geodesics);
    voronoi_renderer.create_geodesics({edgeColors: edge_col, width: 4});
    scene.add(voronoi_renderer.geodesics);
}

function mark_face_degree0(map)
{
    const face = map.face;
    let face_degree = map.get_attribute[face]("face_degree");
    if(!face_degree)
        face_degree = map.add_attribute[face]("face_degree");

    map.foreach[face](
        fd => {
            let n = 0;
            map.foreach_dart_of[face](fd,
                d => {
                    ++n;
                });

            face_degree[map.cell[face](fd)] = n;
        });
}

function get_triangles(map)
{
    const face = map.face;
    let face_degree = map.get_attribute[face]("face_degree");
    let triangles = [];

    let n;
    map.foreach[face](
        fd => {
            n = face_degree[map.cell[face](fd)];
            if(n == 3)
                triangles.push(fd)
        });

    return triangles
}

function get_polys(map)
{
    const face = map.face;
    let face_degree = map.get_attribute[face]("face_degree");
    let polys = [];

    let n;
    map.foreach[face](
        fd => {
            n = face_degree[map.cell[face](fd)];
            if(n > 4)
                polys.push([fd, n]);
        });

    polys.sort(function(a, b){
            if(a[1] > b[1])
                return -1;
            if(a[1] < b[1])
                return 1;
            return 0;
        });
    
    // polys.forEach(fd => console.log(fd, face_degree[map.cell[face](fd)]))
    return polys
}

// sorted by length
function lowest_degree_neighbors(fd)
{
    const map = voronoi_map;
    const vertex = voronoi_map.vertex;
    const edge = voronoi_map.edge;
    const face = voronoi_map.face;
    let face_degree = map.get_attribute[face]("face_degree");
    let neighbors = [];

    let n;
    map.foreach[face](
        fd => {
            n = face_degree[map.cell[face](fd)];
            neighbors.push([fd, n])
        });

    neighbors.sort(function(a, b){
        if(a[1] < b[1])
            return -1;
        if(a[1] > b[1])
            return 1;
        return 0;
    });
    console.log(neighbors);
    return neighbors;
}

function highest_degree_neighbors(fd)
{
    const map = voronoi_map;
    const vertex = voronoi_map.vertex;
    const edge = voronoi_map.edge;
    const face = voronoi_map.face;
    let face_degree = map.get_attribute[face]("face_degree");
    let neighbors = [];

    let n;
    map.foreach_dart_of[face](fd,
        d => {
            n = face_degree[map.cell[face](map.phi2(d))];
            neighbors.push([d, n])
        });

        neighbors.sort(function(a, b){
            if(a[1] > b[1])
                return -1;
            if(a[1] < b[1])
                return 1;
            return 0;
        });

    return neighbors;
}

function cut_edge_voronoi(ed)
{
    const map = voronoi_map;
    const vertex = map.vertex;
    const edge = map.edge;
    
    const pos = map.get_attribute[vertex]("position");
    let p0 = pos[map.cell[vertex](ed)];
    let p1 = pos[map.cell[vertex](map.phi2(ed))];
    let p = slerp(p0, p1, 0.5);
    // let p = p0.clone().add(p1).normalize();
    let v = map.cut_edge(ed);
    pos[map.cell[vertex](v)] = p;
}

function collapse_edge_voronoi(ed)
{
    const map = voronoi_map;
    const vertex = map.vertex;
    const edge = map.edge;
    
    const pos = map.get_attribute[vertex]("position");

    let p0 = pos[map.cell[vertex](ed)];
    let p1 = pos[map.cell[vertex](map.phi2(ed))];
    let p = slerp(p0, p1, 0.5);
    // let p = p0.clone().add(p1).normalize();
    let v = map.collapse_edge(ed);
    pos[map.cell[vertex](v)] = p;
}

function get_shortest_edge(fd)
{
    const map = voronoi_map;
    const vertex = map.vertex;
    const edge = map.edge;
    const face = map.face;
    
    const pos = map.get_attribute[vertex]("position");

    let min = 10;
    let min_ed;
    map.foreach_dart_of[face](fd, 
        d => {
            let p0 = pos[map.cell[vertex](d)];
            let p1 = pos[map.cell[vertex](map.phi2(d))];
            let dist = p0.angleTo(p1);
            if(dist < min)
            {
                min = dist;
                min_ed = d;
            }
        });
    return min_ed;
}

function get_longest_edge(fd)
{
    const map = voronoi_map;
    const vertex = map.vertex;
    const edge = map.edge;
    const face = map.face;
    
    const pos = map.get_attribute[vertex]("position");

    let max = 0;
    let max_ed;
    map.foreach_dart_of[face](fd, 
        d => {
            let p0 = pos[map.cell[vertex](d)];
            let p1 = pos[map.cell[vertex](map.phi2(d))];
            let dist = p0.angleTo(p1);
            if(dist > max)
            {
                max = dist;
                max_ed = d;
            }
        });
    return max_ed;
}

function edge_length(ed)
{
    const map = voronoi_map;
    const vertex = map.vertex;

    const pos = map.get_attribute[vertex]("position");
    let p0 = pos[map.cell[vertex](ed)];
    let p1 = pos[map.cell[vertex](map.phi2(ed))];
    let dist = p0.angleTo(p1);

    return dist;
}

function show_info_voronoi_map()
{
    const map = voronoi_map;
    const vertex = map.vertex;
    const edge = map.edge;
    const face = map.face;
    
    const pos = map.get_attribute[vertex]("position");
    const face_degree = map.get_attribute[face]("face_degree");

    map.foreach[face](
        fd => {
            let neighbors = [];
            let n = face_degree[map.cell[face](fd)];
            map.foreach_dart_of[face](fd, 
                d => {
                    let p0 = pos[map.cell[vertex](d)];
                    let p1 = pos[map.cell[vertex](map.phi2(d))];
                    let dist = p0.angleTo(p1);
                    let n2 = face_degree[map.cell[face](map.phi2(d))];
                    neighbors.push({d: map.phi2(d), f: map.cell[face](map.phi2(d)), l: parseFloat(dist.toFixed(2)), n: n2});
                });

            console.log("face:", fd, map.cell[face](fd), "degree:", n, ...neighbors);
        });

    
    return;
}

function step_voronoi_remesh()
{
    mark_face_degree0(voronoi_map);

    const map = voronoi_map;
    const vertex = map.vertex;
    const edge = map.edge;
    const face = map.face;
    const pos = map.get_attribute[vertex]("position");
    const face_degree = map.get_attribute[face]("face_degree");

    const polys = get_polys(voronoi_map);
    console.log("polys: ", polys);

    if(polys.length)
    {
        let poly = polys[0];
        largest_neighbors = highest_degree_neighbors(poly[0]);
        let max_degree = largest_neighbors[0][1];
        let i = 1;
        let selected = 0;
        let shortest_edge = edge_length(largest_neighbors[0][0]);
        while(i < largest_neighbors.length && largest_neighbors[i][1] == max_degree)
        {
            let el = edge_length(largest_neighbors[i][0]);
            if(el < shortest_edge)
            {
                shortest_edge = el;
                selected = i;
            }
            i++;
        }
        collapse_edge_voronoi(largest_neighbors[selected][0]);
    }
    else
    {
        const tris = get_triangles(voronoi_map);
        if(tris.length)
        {
            let tri = tris[0];
            smallest_neighbors = lowest_degree_neighbors(tri[0]);
            let min_degree = smallest_neighbors[0][1];
            let i = 1;
            let selected = 0;
            let longest_edge = edge_length(smallest_neighbors[0][0]);
            while(i < smallest_neighbors.length && smallest_neighbors[i][1] == min_degree)
            {
                let el = edge_length(smallest_neighbors[i][0]);
                if(el > longest_edge)
                {
                    longest_edge = el;
                    selected = i;
                }
                i++;
            }
            cut_edge_voronoi(smallest_neighbors[selected][0]);
        }
    }
    test_voronoi_map();
}


function mark_vertex_degree(map)
{
    const vertex = map.vertex;
    let vertex_degree = map.get_attribute[vertex]("vertex_degree");
    if(!vertex_degree)
        vertex_degree = map.add_attribute[vertex]("vertex_degree");

    map.foreach[vertex](
        vd => {
            let n = 0;
            map.foreach_dart_of[vertex](vd,
                d => {
                    ++n;
                });

            vertex_degree[map.cell[vertex](vd)] = n;
        });
    
    return vertex_degree;
}

function mark_vertex_degree(map)
{
    const vertex = map.vertex;
    let vertex_degree = map.get_attribute[vertex]("vertex_degree");
    if(!vertex_degree)
        vertex_degree = map.add_attribute[vertex]("vertex_degree");

    map.foreach[vertex](
        vd => {
            let n = 0;
            map.foreach_dart_of[vertex](vd,
                d => {
                    ++n;
                });

            vertex_degree[map.cell[vertex](vd)] = n;
        });
    
    return vertex_degree;
}

let barys;
let dual;
function modify_delaunay(done = false)
{
    const map = delaunay_map;
    const vertex = map.vertex;
    const edge = map.edge;
    const face = map.face;
    const pos = map.get_attribute[vertex]("position");
    // map.merge_faces(0);

    let edge_cache = []
    map.foreach[edge](ed => edge_cache.push(ed));

    const vertex_degree = mark_vertex_degree(map);


    const col = map.add_attribute[vertex]("col");
    map.foreach[map.vertex](
        vd => {
            let n = vertex_degree[map.cell[vertex](vd)];
            if(n < 4)
                col[map.cell[vertex](vd)] = new THREE.Color(1, 0, 0);
            if(n == 4)
                col[map.cell[vertex](vd)] = new THREE.Color(0, 1, 0);
            if(n > 4)
                col[map.cell[vertex](vd)] = new THREE.Color(0, 0, 1);
        });

    let barys_geo = new THREE.Geometry();
    map.foreach[map.face](
        fd => {
            let points = [];
            map.foreach_dart_of[face](fd,
                d => {
                    points.push(pos[map.cell[vertex](d)]);
                });
            barys_geo.vertices.push(barycenter(points));
        });

    let material = new THREE.PointsMaterial(
        {
            size: 0.025,
            color: 0xFF0000
        });


    if(barys)
        {
            scene.remove(barys);
            // barys.geometry.dipose();
        }

    barys = new THREE.Points(barys_geo, material); 
    scene.add(barys);

    scene.remove(delaunay_renderer.geodesics);
    delaunay_renderer.create_geodesics({vertexColors: col});
    // delaunay_renderer.create_points({color: 0xFF0000});
    scene.add(delaunay_renderer.geodesics);
    // scene.add(delaunay_renderer.points);

    let dual_map = map_dual(delaunay_map, barycenter);
    let dual_renderer = Renderer_Spherical(dual_map);

    dual_renderer.create_geodesics({color: done? new THREE.Color(0.4, 0.0, 0.1) : new THREE.Color(0.1, 0.1, 0.8)});
    scene.remove(dual);
    dual = dual_renderer.geodesics;
    scene.add(dual_renderer.geodesics);

}

function map_sort_vert_high_degree(map, degree){
    const vertex = map.vertex;
    // let vertices = map.cache(vertex);
    let vertices = [];
    map.foreach[vertex](
        vd => {
            vertices.push(vd);    
        });

    vertices.sort(function(a, b){
        if(degree[map.cell[vertex](a)] > degree[map.cell[vertex](b)])
            return -1;
        if(degree[map.cell[vertex](a)] < degree[map.cell[vertex](b)])
            return 1;
        return 0;
    });

    // console.log(vertices);
    return vertices;
}

function map_sort_vert_low_degree(map, degree){
    const vertex = map.vertex;
    // let vertices = map.cache(vertex);
    let vertices = [];
    map.foreach[vertex](
        vd => {
            vertices.push(vd);    
        });

    vertices.sort(function(a, b){
        if(degree[map.cell[vertex](a)] < degree[map.cell[vertex](b)])
            return -1;
        if(degree[map.cell[vertex](a)] > degree[map.cell[vertex](b)])
            return 1;
        return 0;
    });

    console.log(vertices);
    return vertices;
}

function sort_cache(map, emb, cache, crit, incr = true)
{
    cache.sort(function(a, b){
        if(crit[map.cell[emb](incr? a : b)] < crit[map.cell[emb](incr? b : a)])
            return -1;
        if(crit[map.cell[emb](incr? a : b)] > crit[map.cell[emb](incr? b : a)])
            return 1;
        return 0;
    });
}

function on_face(map, vd0, vd1)
{
    const vertex = map.vertex;
    const face = map.face;

    const vid1 = map.cell[vertex](vd1);
    let d1 = -1;
    map.foreach_dart_of[face](vd0, 
        d => {
            if(map.cell[vertex](d) == vid1)
                d1 = d;
        });
    return d1;
}

function mark_face_degree(map)
{
    const face = map.face;
    let face_degree = map.get_attribute[face]("face_degree");
    if(!face_degree)
        face_degree = map.add_attribute[face]("face_degree");

    map.foreach[face](
        fd => {
            let n = 0;
            map.foreach_dart_of[face](fd,
                d => {
                    ++n;
                });

                face_degree[map.cell[face](fd)] = n;
        });
    
    return face_degree;
}


function mark_edge_max_angle(map, pos)
{
    const vertex = map.vertex;
    const edge = map.edge;
    let edge_angles = map.get_attribute[edge]("edge_angles");
    if(!edge_angles)
        edge_angles = map.add_attribute[edge]("edge_angles");

    let angle = function(A, B, C){
        let sB = slerp(A, B, 0.01);
        let sC = slerp(A, C, 0.01);
        let AB = (sB.clone().sub(A)).normalize();
        let AC = (sC.clone().sub(A)).normalize();
        let X = AB.clone().cross(AC).normalize();
        let a = AB.angleTo(AC);
        if(A.dot(X) < 0)
            a = -a;
        return a;
    }


    map.foreach[edge](ed => {
        let e0 = ed;
        let e1 = map.phi2(ed);

        let A, B, C;
        A = pos[map.cell[vertex](e0)];
        B = pos[map.cell[vertex](e1)];
        C = pos[map.cell[vertex](map.phi_1(e0))];
        let a00 = angle(A, B, C);
        C = B;
        B = pos[map.cell[vertex](map.phi2(map.phi1(e1)))];
        let a01 = angle(A, B, C);
        let a0 = a00 + a01;

        A = pos[map.cell[vertex](e1)];
        B = pos[map.cell[vertex](e0)];
        C = pos[map.cell[vertex](map.phi_1(e1))];
        let a10 = angle(A, B, C);
        C = B;
        B = pos[map.cell[vertex](map.phi2(map.phi1(e0)))];
        let a11 = angle(A, B, C);
        let a1 = a10 + a11;

        edge_angles[map.cell[edge](ed)] = Math.max(a0, a1)
    })

    return edge_angles;

}

function edge_attr_sum(map, emb, attr)
{
    const edge = map.edge;
    let edge_sum = map.add_attribute[edge]("edge_sum");
    map.foreach[edge](ed => {
        edge_sum[map.cell[edge](ed)] =
         attr[map.cell[emb](ed)];
        edge_sum[map.cell[edge](map.phi2(ed))] += attr[map.cell[emb](map.phi2(ed))];
    });

    return edge_sum;
}

function edge_attr_min(map, emb, attr)
{
    const edge = map.edge;
    let edge_min = map.add_attribute[edge]("edge_min");
    map.foreach[edge](ed => {
        edge_min[map.cell[edge](ed)] = Math.min(attr[map.cell[emb](ed)], attr[map.cell[emb](map.phi2(ed))])
    });

    return edge_min;
}

function edge_attr_max(map, emb, attr)
{
    const edge = map.edge;
    let edge_max = map.add_attribute[edge]("edge_max");
    map.foreach[edge](ed => {
        edge_max[map.cell[edge](ed)] = Math.max(attr[map.cell[emb](ed)], attr[map.cell[emb](map.phi2(ed))])
    });

    return edge_max;
}


function one_step_delaunay_remesh()
{
    const map = delaunay_map;
    const vertex = map.vertex;
    const edge = map.edge;
    const face = map.face;

    if(!map.is_embedded[edge]())
        map.set_embeddings[edge]();

    const vertex_degree = mark_vertex_degree(map);

    let done = true;
    map.foreach[vertex](vd => {
        done &= (vertex_degree[map.cell[vertex](vd)] == 4); 
    });
    if(done){
        console.log("remeshing done")
        modify_delaunay(true)
        return;
    }

    const pos = map.get_attribute[vertex]("position");
    const face_degree = mark_face_degree(map);
    const edge_vert_sum = edge_attr_sum(map, vertex, vertex_degree);
    const edge_face_sum = edge_attr_sum(map, face, face_degree);
    const edge_vert_min = edge_attr_min(map, vertex, vertex_degree);
    const edge_face_max = edge_attr_max(map, face, face_degree);
    const edge_angle = mark_edge_max_angle(map, pos);
    // console.log(edge_vert_sum);
    // console.log(edge_face_sum);
    // console.log(edge_vert_min);
    // console.log(edge_face_max);

    let vertex_cache = [];
    map.foreach[vertex](vd => vertex_cache.push(vd));


    let vertices = map_sort_vert_high_degree(map, vertex_degree);
    sort_cache(map, vertex, vertices, vertex_degree, false);

    let vertices5 = vertex_cache.filter(vd => vertex_degree[map.cell[vertex](vd)] > 4);

    // function deletable(ed)
    // {
        
    // }

    if(vertices5.length)
    {   
        let edge_cache_angle = [];
        map.foreach[edge](ed => edge_cache_angle.push(ed));
        sort_cache(map, edge, edge_cache_angle, edge_angle);
        edge_cache_angle.forEach(vd => console.log("angle ", vd, edge_angle[map.cell[edge](vd)].toPrecision(3)));

        let min_edge = undefined;
        let i;
        for(i = 0; i < edge_cache_angle.length; ++i)
        {
            if(edge_vert_min[map.cell[edge](edge_cache_angle[i])] > 4)
            {
                console.log(edge_vert_min[map.cell[edge](edge_cache_angle[i])]);
                map.merge_faces(edge_cache_angle[i]);
                break;
            }
            if(edge_vert_sum [map.cell[edge](edge_cache_angle[i])] > 8 && edge_vert_min[map.cell[edge](edge_cache_angle[i])] == 4 && !min_edge)
            {
                min_edge = edge_cache_angle[i];
            }
        }
        if(i == edge_cache_angle.length && min_edge)
            map.merge_faces(min_edge);
    }
    // else
    // {
    //     map.foreach[face](
    //         fd => {
    //             let v3s = [];
    //             map.foreach_dart_of[face](fd, 
    //                 vd => {
    //                     if(vertex_degree[map.cell[vertex](vd)] == 3)
    //                         v3s.push(vd);
    //                 });
    //             if(v3s.length > 2)
    //                 console.log(v3s);
    //         }
    //     )
    // }

    // if(vertices5.length)
    // {   
    //     let edge_cache_vert = [];
    //     map.foreach[edge](ed => edge_cache_vert.push(ed));
    //     let edge_cache_face = [];
    //     map.foreach[edge](ed => edge_cache_face.push(ed));
    //     let edge_cache_face_max = [];
    //     map.foreach[edge](ed => edge_cache_face_max.push(ed));
    //     let edge_cache_vert_min = [];
    //     map.foreach[edge](ed => edge_cache_vert_min.push(ed));

    //     sort_cache(map, edge, edge_cache_vert, edge_vert_sum, false);
    //     sort_cache(map, edge, edge_cache_face, edge_face_sum, false);
    //     sort_cache(map, edge, edge_cache_face_max, edge_vert_sum, false);
    //     sort_cache(map, edge, edge_cache_vert_min, edge_vert_sum, false);

    //     let max_edge_deg = edge_vert_sum[map.cell[edge](edge_cache_vert[0])];
    //     let max_edge_deg_cache = edge_cache_vert.filter(ed => {
    //         return edge_vert_sum[map.cell[edge](ed)] == max_edge_deg;
    //     })


    //     sort_cache(map, edge, max_edge_deg_cache, edge_face_sum, true);

    //     let max_face_sum = edge_face_sum[map.cell[edge](max_edge_deg_cache[0])];
    //     let min_angle_edges_cache = max_edge_deg_cache.filter(ed => {return edge_face_sum[map.cell[edge](ed)] == max_face_sum});
    //     sort_cache(map, edge, min_angle_edges_cache, edge_angle);
    //     min_angle_edges_cache.forEach(vd => console.log("angle ", vd, edge_angle[map.cell[edge](vd)].toPrecision(3)));
    //     map.merge_faces(min_angle_edges_cache[0]);
    // }


    else
    {
        let vertices3 = vertex_cache.filter(vd => vertex_degree[map.cell[vertex](vd)] < 4);
        if(vertices3.length)
        {
            // if(vertices3.length == 2)
            // {
                // dijkstra_delaunay(vertices3[0])
                let lengths_topo = get_edges_length(map, true);
                let graph = dijkstra(map, vertices3[0], lengths_topo)
                lengths_topo.delete();

                let dp = graph.previous[map.cell[vertex](vertices3[1])];
                // let dp1 = on_face(map, vertices3[0], vertices3[1]);
                let dp0, dp1;
                map.foreach_dart_of[vertex](vertices3[0],
                    d0 => {
                        d1 = on_face(map, d0, vertices3[1]); 
                        if(d1 != -1)
                        {
                            dp0 = d0;
                            dp1 = d1
                        }
                    });

                if(dp1 != undefined && dp1 != -1)
                {
                    map.cut_face(dp0, dp1);

                }
                else
                {
                    let path = [];
                    do
                    {
                        path.push(dp);
                        dp = graph.previous[map.cell[vertex](dp)];
                    } while(dp != -1)
                    
                    if(!(path.length%2))
                    {
                        let d0 = path.shift();
                        let d1 = map.phi1(d0);
                        let d2 = map.phi_1(d0);
                        map.cut_face(d1, d2);
                        map.merge_faces(d2);
                    }
                    for(let i = 0; i < path.length; ++i)
                    {
                        if(!(i%2))
                        {
                            map.cut_face(path[i], map.phi1(path[i]));
                        }
                        else
                            map.merge_faces(path[i]);
                    }

                    lengths_topo.delete();
                }
            // }
            // map.cut_face(min_degree_neigh_vertex, map.phi1(min_degree_neigh_vertex))
        }   

    }

    modify_delaunay();

    vertex_degree.delete();
    face_degree.delete();
    edge_vert_sum.delete();
    edge_face_sum.delete();
    edge_vert_min.delete();
    edge_angle.delete();
    edge_face_max.delete();
}

function get_edges_length(map, topo = false)
{
    const vertex = map.vertex;
    const edge = map.edge;

    if(!map.is_embedded[edge]()){
        map.create_embedding[edge]();
        map.set_embeddings[edge]();    
    }
    const pos = map.get_attribute[vertex]("position");

    const lengths = map.add_attribute[edge]("lengths");
    map.foreach[edge](ed => {
        lengths[map.cell[edge](ed)] = topo? 1 : pos[map.cell[vertex](ed)].angleTo(pos[map.cell[vertex](map.phi2(ed))]);
    });

    return lengths;
}

function dijkstra_delaunay(vd0, topo = false)
{
    const map = delaunay_map;
    const edge = map.edge;
    const vertex = map.vertex;
    const lengths = get_edges_length(map, topo);
    console.log(lengths);
    let graph = dijkstra(map, vd0, lengths);
    console.log("dijkstra:",graph.previous[map.cell[vertex](vd0)]);
    scene.remove(delaunay_renderer.geodesics);

    let col = map.add_attribute[edge]("colors");
    map.foreach[edge](ed => {
        col[map.cell[edge](ed)] = new THREE.Color(1, 1, 1);
    })
    map.foreach[vertex](vd => {
        let ed = graph.previous[map.cell[vertex](vd)];
        console.log(ed);
        if(ed != -1)
            col[map.cell[edge](ed)] = new THREE.Color(1, 0, 0);

    });

    delaunay_renderer.create_geodesics({edgeColors: col});
    // delaunay_renderer.create_points({color: 0xFF0000});
    scene.add(delaunay_renderer.geodesics);
}

function create_test_string()
{
    let s = "test: function(){\n\tthis.reset();\n";

        points.forEach(p => {
            s += "\tcreate_branch(new THREE.Vector3(";
            s += p.x + ", ";
            s += p.y + ", ";
            s += p.z + "));\n";
        });
        s+= "},"
    console.log(s);    
}
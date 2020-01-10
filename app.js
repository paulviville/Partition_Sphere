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
    drawing: 0x000000
};

var showing = {
    partition: true,
    voronoi: false,
    delaunay: false,
    quad_input: false,
}

var test_sets = {
    // example of test set
    test0: function() {
        this.reset();
        create_branch(new THREE.Vector3(0.6022189360479403, 0.7368469495958743, 0.3072278078829223));
        create_branch(new THREE.Vector3(-0.13518906815654932, -0.5233125218963196, 0.8413488695407381));
        create_branch(new THREE.Vector3(0.6333494652638829, 0.19158420104961565, 0.7497759323678848));
        create_branch(new THREE.Vector3(0.25380677790900835, 0.8896366161154757, -0.3796430043528435));
        create_branch(new THREE.Vector3(0.27366915301936295, -0.678333516859912, -0.6818862328791571));
        create_branch(new THREE.Vector3(-0.6340194340841504, -0.05912754393972449, -0.7710533643991638));
    },

    nb_branches : 4,
    random: function(){
        this.reset();
        for(let i = 0; i < this.nb_branches; i++)
        {
            let v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

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
let gui = new dat.GUI({autoPlace: true});

gui.add(showing, "partition").onChange(require_update);
let folder_partition = gui.addFolder("Partition Colors");
folder_partition.addColor(colors, 'partition').onChange(require_update);
folder_partition.addColor(colors, 'partition_points').onChange(require_update);
gui.add(showing, "voronoi").onChange(require_update);

let folder_voronoi = gui.addFolder("Voronoi Colors");
folder_voronoi.addColor(colors, 'voronoi').onChange(require_update);
folder_voronoi.addColor(colors, 'voronoi_points').onChange(require_update);
gui.add(showing, "delaunay").onChange(require_update);

let folder_delaunay = gui.addFolder("Delaunay Colors");
folder_delaunay.addColor(colors, 'delaunay').onChange(require_update);

gui.add(showing, "quad_input").onChange(require_update);
let folder_quad = gui.addFolder("Quad Input");
folder_quad.addColor(colors, 'quad_input').onChange(require_update);
folder_quad.addColor(colors, 'quad_input_seeds').onChange(require_update);
folder_quad.addColor(colors, 'quad_input_points').onChange(require_update);

let folder_test = gui.addFolder("Tests");
folder_test.add(test_sets, "test0").onChange(require_update);
folder_test.add(test_sets, "nb_branches").onChange(require_update);
folder_test.add(test_sets, "random").onChange(require_update);
gui.add(test_sets, "reset").onChange(require_update);

gui.addColor(colors, "drawing");

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
}

function onKeyUp(event)
{
    // console.log(event.which);
    keys[event.which] = false;
    switch(event.which){
        case 68: // d
            drawing0 = null;
            drawing1 = null;
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
    scene.add(sphere);

    let center_mat = new THREE.MeshLambertMaterial({color: 0x222222});
    let center_geom = new THREE.SphereGeometry( 0.025, 32, 32 );
    let center = new THREE.Mesh(center_geom, center_mat);
    scene.add(center);
    
    points = [];
    branch_lines = new THREE.Group();
    branch_points = new THREE.Group();
    scene.add(branch_lines);
    scene.add(branch_points);

    selector = new THREE.Mesh(new THREE.SphereGeometry( 0.026, 16, 16 ), new THREE.MeshLambertMaterial({color: 0x22FFFF}));
    selector.material.visible = false;
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
	delaunay_renderer.create_geodesics(colors.delaunay);
    scene.add(delaunay_renderer.geodesics);
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
	}

	if(on) create_voronoi();
	if(on && showing.voronoi) show_voronoi();
}

function show_voronoi()
{
	showing_voronoi = true;
	voronoi_renderer.create_geodesics(colors.voronoi);
	voronoi_renderer.create_points(colors.voronoi_points);
    scene.add(voronoi_renderer.points);
    scene.add(voronoi_renderer.geodesics);
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
	iteration_renderer.create_geodesics(colors.partition);
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

// function rotate_frame(i, angle)
// {
//     if(!quad_input_frames) return;

//     quad_input_frames[i][0].applyAxisAngle(points[i], angle);
//     quad_input_frames[i][1].applyAxisAngle(points[i], angle);
//     require_update();
// }

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
    console.log(fe);
    let material = new THREE.LineBasicMaterial({color:0xFFFFFF});
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

    scene.add(geodesics)
}

var hand_drawn_lines;
var last_drawn_line;
function init_drawing()
{
    hand_drawn_lines = new THREE.Group();
    scene.add(hand_drawn_lines);
}

function add_drawn_line(A, B)
{
    let material = new THREE.LineBasicMaterial({color: colors.drawing});
    let line = new THREE.Line(new THREE.Geometry(), material);
    line.geometry.vertices = new_geodesic(A, B, 100);
    last_drawn_line = line;
    hand_drawn_lines.add(line);
}

function reset_drawing()
{
    while(hand_drawn_lines.children.length)
        hand_drawn_lines.remove(hand_drawn_lines.children[0]);
}

function delete_last_line()
{
    if(last_drawn_line)
        hand_drawn_lines.remove(last_drawn_line);
    last_drawn_line = null;       
}
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
    quad_input_points: 0xFF0000
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
        quad_input_frames = null;
    }
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

let folder_test = gui.addFolder("Tests");
folder_test.add(test_sets, "test0").onChange(require_update);
folder_test.add(test_sets, "nb_branches").onChange(require_update);
folder_test.add(test_sets, "random").onChange(require_update);
gui.add(test_sets, "reset").onChange(require_update);

// SCENE RENDERING
function start()
{
	init_scene();
    rendering_loop();
}


var VORONOI_ON = true;
var ITERATIVE_ON = true;

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
        default:
            break;
    }
}

let mouse = new THREE.Vector2();
let previous_pos = new THREE.Vector3();
let current_pos = new THREE.Vector3();
let raycaster = new THREE.Raycaster();
let selected_point;
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
            }
            else
            {
                selected_point = intersections[0].object;
                console.log("point : " + selected_point.userData.id);
                previous_pos.copy(intersections[0].point).normalize();
                window.addEventListener('mousemove', onMouseMove, false)
                window.addEventListener('mouseup', onMouseUp, false);       
            }
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
}

function get_geodesic(A, B, inside = false)
{
    let geodesics_line_material = new THREE.LineBasicMaterial({linewidth: 3, color: 0x000000});
    let line = new THREE.Line(new THREE.Geometry(), geodesics_line_material);
	line.geometry.vertices = new_geodesic(A, B, 100, inside);
    return line;
}






// MAP RENDERER OVERLOAD
function Renderer_Sphere(map)
{
    let renderer = Renderer(map);
    renderer.create_geodesics = function(color = 0x000000)
    {
        if(this.geodesics) return;

        let map = this.cmap;
        let position = map.get_attribute[map.vertex]("position");
        let material = new THREE.LineBasicMaterial({color:color});
        this.geodesics = new THREE.Group();

        map.foreach[map.edge](
            ed => {
                let line = new THREE.Line(new THREE.Geometry(), material);
                line.geometry.vertices = new_geodesic(
                    position[map.cell[map.vertex](ed)], 
                    position[map.cell[map.vertex](map.phi1(ed))],
                    100);
                this.geodesics.add(line);
            }
        );
    };

    renderer.create_curved_faces = function(color)
    {
        if(color = undefined) 
            color = 0xFFFFFF; // TODO random color
    }
    return renderer;
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
	delaunay_renderer = Renderer_Sphere(delaunay_map);

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
	voronoi_renderer = Renderer_Sphere(voronoi_map);
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
	iteration_renderer = Renderer_Sphere(iteration_map);
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

// // ITERATIVE PARTITION
var quad_input_frames;
var quad_input_map;
var quad_input_del_map;
var quad_input_renderer;
var quad_input_del_renderer;

function rotate_frame(i, angle)
{
    if(!quad_input_frames) return;

    quad_input_frames[i][0].applyAxisAngle(points[i], angle);
    quad_input_frames[i][1].applyAxisAngle(points[i], angle);
    require_update();
}

function create_quad_input_frames()
{
    quad_input_frames = create_frames(points);
}

function update_frame(i)
{
    if(quad_input_frames)
        quad_input_frames[i] = create_frame(points[i]);
}

function create_quad_input()
{
    if(!quad_input_frames) create_quad_input_frames();

    let quad_points = create_quads(points, quad_input_frames);
    quad_input_del_map = delaunay(quad_points);
    quad_input_map = voronoi(quad_input_del_map);
	quad_input_renderer = Renderer_Sphere(quad_input_map);
	quad_input_del_renderer = Renderer_Sphere(quad_input_del_map);
}

function update_quad_input(on)
{
	if(quad_input_renderer)
	{
		scene.remove(quad_input_renderer.points);
		scene.remove(quad_input_renderer.geodesics);
	}

	if(on) create_quad_input();
	if(on && showing.quad_input) show_quad_input();
}

function show_quad_input()
{
    showing.iteration = true;
    quad_input_renderer.create_points(colors.partition_points);
	quad_input_renderer.create_geodesics(colors.partition);
	scene.add(quad_input_renderer.points);
	scene.add(quad_input_renderer.geodesics);

	// quad_input_del_renderer.create_points(colors.partition_points);
	// quad_input_del_renderer.create_geodesics(colors.partition);
	// scene.add(quad_input_del_renderer.points);
	// scene.add(quad_input_del_renderer.geodesics);
}


// TEST SETS
function test_set0()
{
	create_branch(new THREE.Vector3(0.6022189360479403, 0.7368469495958743, 0.3072278078829223));
	create_branch(new THREE.Vector3(-0.13518906815654932, -0.5233125218963196, 0.8413488695407381));
	create_branch(new THREE.Vector3(0.6333494652638829, 0.19158420104961565, 0.7497759323678848));
	create_branch(new THREE.Vector3(0.25380677790900835, 0.8896366161154757, -0.3796430043528435));
	create_branch(new THREE.Vector3(0.27366915301936295, -0.678333516859912, -0.6818862328791571));
	create_branch(new THREE.Vector3(-0.6340194340841504, -0.05912754393972449, -0.7710533643991638));
}



const Renderer_base = {
    cmap: undefined,
    faces: undefined,
    edges: undefined,
    points: undefined,

    create_points: function()
        {
            if(this.cmap.vertex == undefined)
                return false;

            let position = this.cmap.get_attribute[this.cmap.vertex]("position");
            if(position == undefined)
                return false;

            let geometry = new THREE.Geometry();
            this.cmap.foreach[this.cmap.vertex](vd => {
                geometry.vertices.push(position[this.cmap.cell[this.cmap.vertex](vd)])});
            let material = new THREE.PointsMaterial({color: 0xff0000, size: 0.05});
            this.points = new THREE.Points(geometry, material); 

            this.points = new THREE.Points(geometry, material); 
            return true;
        },

    create_edges: function()
        {
            let map = this.cmap;
            let position = map.get_attribute[map.vertex]("position");
            let material = new THREE.LineBasicMaterial({color:0x000000});
            let geometry = new THREE.Geometry();
            map.foreach[map.edge](
                ed => {
                    geometry.vertices.push(position[map.cell[map.vertex](ed)]);
                    geometry.vertices.push(position[map.cell[map.vertex](map.phi1(ed))]);
                }
            );
            this.edges = new THREE.LineSegments(geometry, material);
        },

    create_faces: function()
        {
            let map = this.cmap;
            let position = map.get_attribute[map.vertex]("position");
            let material = new THREE.MeshBasicMaterial({color:0xFFFFFF});
            let geometry = new THREE.Geometry();
            geometry.vertices = position;
            map.foreach[map.face](
                fd => {
                    let face = [];
                    map.foreach_dart_phi1(fd, d => {
                        face.push(map.cell[map.vertex](d));
                    });
                    
                    for(let i = 2; i < face.length; i++)
                    {
                        let f = new THREE.Face3(face[0],face[i-1],face[i]);
                        geometry.faces.push(f);
                    }
                }
            );
            this.faces = new THREE.Mesh(geometry, material);
        },
}

function Renderer(cmap)
{
    const renderer = Object.create(Renderer_base);
    renderer.cmap = cmap;
    return renderer;
}
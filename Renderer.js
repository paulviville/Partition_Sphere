const Renderer_base = {
    cmap: undefined,
    faces: undefined,
    edges: undefined,
    points: undefined,

    create_points: function(params = {})
        {
            const map = this.cmap;
            const vertex = map.vertex;
            const position = map.get_attribute[vertex]("position");

            const geometry = new THREE.Geometry();
            map.foreach[vertex](vd => {
                geometry.vertices.push(position[map.cell[vertex](vd)])});
            
            let material;
            if(params.vertexColors)
            {
                const colors = params.vertexColors;
                map.foreach[vertex](vd => {
                    geometry.colors.push(colors[map.cell[vertex](vd)])});

                material = new THREE.PointsMaterial(
                    {
                        size: params.size || 0.025,
                        vertexColors: THREE.VertexColors
                    });
            }
            else
                material = new THREE.PointsMaterial(
                    { 
                        color: params.color || 0xFF0000,
                        size: params.size || 0.025
                    });

            
            this.points = new THREE.Points(geometry, material); 
        },

    create_edges: function(params = {})
        {
            const map = this.cmap;
            const vertex = map.vertex;
            const edge = map.edge;

            const position = map.get_attribute[vertex]("position");

            const geometry = new THREE.Geometry();

            map.foreach[edge](
                ed => {
                    geometry.vertices.push(position[map.cell[vertex](ed)]);
                    geometry.vertices.push(position[map.cell[vertex](map.phi1(ed))]);
                }
            );

            let material;
            if(params.edgeColor)
            {
                const colors = params.edgeColor;
                map.foreach[edge](
                    ed => {
                        geometry.colors.push(colors[map.cell[edge](ed)]);
                        geometry.colors.push(colors[map.cell[edge](ed)]);
                    }
                );
                material = new THREE.LineBasicMaterial(
                    {
                        vertexColors: THREE.VertexColors,
                        linewidth: params.width || 2
                    });
            }
            else{
                if(params.vertexColors)
                {
                    const colors = params.vertexColors;
                    map.foreach[edge](
                        ed => {
                            geometry.colors.push(colors[map.cell[vertex](ed)]);
                            geometry.colors.push(colors[map.cell[vertex](map.phi2(ed))]);
                        }
                    );
                    material = new THREE.LineBasicMaterial(
                        {
                            vertexColors: THREE.VertexColors,
                            linewidth: params.width || 2
                        });
                }
                else
                {
                    material = new THREE.LineBasicMaterial(
                    {
                        color: params.color || 0x000000,
                        linewidth: params.width || 2
                    });
                }
            }
            
            this.edges = new THREE.LineSegments(geometry, material);
        },

    create_faces: function(params = {})
        {
            const map = this.cmap;
            const vertex = map.vertex;
            const edge = map.edge;
            const face = map.face;
            
            const position = map.get_attribute[map.vertex]("position");

            const geometry = new THREE.Geometry();
            geometry.vertices = position;
            map.foreach[face](
                fd => {
                    let f_ids = [];
                    map.foreach_dart_phi1(fd, d => {
                        f_ids.push(map.cell[vertex](d));
                    });
                    
                    for(let i = 2; i < f_ids.length; i++)
                    {
                        let f = new THREE.Face3(f_ids[0],f_ids[i-1],f_ids[i]);
                        geometry.faces.push(f);

                        if(map.is_embedded[face]())
                            f.id = map.cell[face](fd);
                    }
                }
            );

            let material;
            if(params.faceColors)
            {
                const colors = params.faceColors;
                geometry.faces.forEach(f => f.color = colors[f.id].clone());
                material = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
            }
            else
            {
                if(params.vertexColors)
                {

                }
                else 
                    material = new THREE.MeshBasicMaterial({color:params.color || 0xBBBBBB});
            }

            this.faces = new THREE.Mesh(geometry, material);
		},
		
	clear_points: function()
		{
            if(this.points)
    			this.points.geometry.dispose()
		},
}

function Renderer(cmap)
{
    const renderer = Object.create(Renderer_base);
    renderer.cmap = cmap;
    return renderer;
}
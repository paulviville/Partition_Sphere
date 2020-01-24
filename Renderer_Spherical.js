function Renderer_Spherical(map)
{
    let renderer = Renderer(map);

    renderer.create_geodesics = function(params = {})
    {
        let map = this.cmap;
        let vertex = map.vertex;
        let edge = map.edge;
        let position = map.get_attribute[vertex]("position");

        this.geodesics = new THREE.Group();
        this.geodesics.name = "geodesics";
        map.foreach[edge](
            ed => {
                let geometry = new THREE.Geometry();
                geometry.vertices = new_geodesic(
                    position[map.cell[vertex](ed)], 
                    position[map.cell[vertex](map.phi1(ed))],
                    100);

                let material;
                if(params.edgeColors)
                {
                    let color = params.edgeColors[map.cell[edge](ed)];
                    material = new THREE.LineBasicMaterial(
                        {
                            color: color,
                            linewidth: params.width || 2
                        });
                }
                else
                {
                    if(params.vertexColors)
                    {
                        material = new THREE.LineBasicMaterial(
                            {
                                vertexColors: THREE.VertexColors,
                                linewidth: params.width || 2
                            });
                        
                        let colA = params.vertexColors[map.cell[vertex](ed)].clone();
                        let colB = params.vertexColors[map.cell[vertex](map.phi2(ed))].clone();
                        for(let i = 0; i <= 100; ++i)
                        {
                            let col0 = colA.clone();
                            let col1 = colB.clone();
                            let color = new THREE.Color();
                            color.addColors(
                                    col0.multiplyScalar(1 - i / 100),
                                    col1.multiplyScalar(i / 100)
                                );
                            geometry.colors.push(color);
                        }
                    }
                    else
                    {
                        material = new THREE.LineBasicMaterial(
                            {
                                color:params.color || 0x000000,
                                linewidth: params.width || 2
                            });
                    }
                }

                let line = new THREE.Line(geometry, material);
    
                this.geodesics.add(line);
            }
        );
    };

    renderer.create_curved_faces = function(params = {})
    {
        const map = this.cmap;
        const vertex = map.vertex;
        const face = map.face;
        const pos = map.get_attribute[vertex]("position");

        this.curved_faces = new THREE.Group();
        this.curved_faces.name = "curved_faces";
        map.foreach[face](
            fd => {
                let vertices = []
                let centroid = new THREE.Vector3();
                map.foreach_dart_of[face](fd, 
                    d => {
                        centroid.add(pos[map.cell[vertex](d)]);
                        vertices.push(pos[map.cell[vertex](d)]);
                    }
                );
                centroid.normalize();

                let material;
                if(params.faceColors)
                    material = new THREE.MeshLambertMaterial(
                        {
                            color: params.faceColors[map.cell[face](fd)],
                            opacity: params.opacity || 1,
                            transparent: params.opacity? true : false
                        });
                else
                    material = new THREE.MeshLambertMaterial(
                        {
                            color: 0xFFFFFF * Math.random(),
                            opacity: params.opacity || 1,
                            transparent: params.opacity? true : false
                        });

                for(let i = 0; i < vertices.length; ++i)
                {
                    let divs = 50;
                    let geometry = new THREE.Geometry();
                    geometry.vertices.push(...subdivide_triangle(centroid, vertices[i], vertices[(i+1) % vertices.length], divs));
                    let n = 1;
                    let k = 0;
                    while(n <= divs)
                    {
                        let k_max = n + k;
                        let l = k_max;
                        let start = k;
                        while(k < k_max)
                        {
                            if(k == start)
                            {
                                geometry.faces.push(new THREE.Face3(k++, l, ++l));
                            }
                            else
                            {
                                geometry.faces.push(new THREE.Face3(k, k - 1, l));
                                geometry.faces.push(new THREE.Face3(k++, l, ++l));
                            }
                        } 
                        ++n;
                    }

                    let face_mesh = new THREE.Mesh(geometry, material);
                    this.curved_faces.add(face_mesh);
                }
            }
        );

        return true;
    }
    return renderer;
}
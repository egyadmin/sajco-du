import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box, Calendar, Users, ArrowUpDown, MoreVertical, Download, Share2, Eye } from 'lucide-react';

interface Model {
  id: number;
  name: string;
  discipline: string;
  version: string;
  lastUpdated: string;
  status: 'active' | 'review' | 'archived';
  conflicts: number;
  thumbnail?: string;
  collaborators: number;
}

const models: Model[] = [
  {
    id: 1,
    name: 'المخطط المعماري الرئيسي',
    discipline: 'معماري',
    version: '2.1',
    lastUpdated: '2024-03-15',
    status: 'active',
    conflicts: 0,
    thumbnail: 'https://images.unsplash.com/photo-1574691250077-03a929faece5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    collaborators: 5
  },
  {
    id: 2,
    name: 'نموذج الهيكل الإنشائي',
    discipline: 'إنشائي',
    version: '1.8',
    lastUpdated: '2024-03-14',
    status: 'review',
    conflicts: 2,
    thumbnail: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    collaborators: 4
  },
  {
    id: 3,
    name: 'نظام التكييف المركزي',
    discipline: 'ميكانيكي',
    version: '1.5',
    lastUpdated: '2024-03-13',
    status: 'active',
    conflicts: 1,
    thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    collaborators: 3
  }
];

const ModelViewer: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');

  useEffect(() => {
    if (!canvasRef.current || !selectedModel) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add a sample building mesh
    const geometry = new THREE.BoxGeometry(2, 4, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      metalness: 0.2,
      roughness: 0.8,
    });
    const building = new THREE.Mesh(geometry, material);
    scene.add(building);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (canvasRef.current?.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, [selectedModel]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'review':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'review':
        return 'قيد المراجعة';
      default:
        return 'مؤرشف';
    }
  };

  const sortedModels = [...models].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSortBy('date')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>تاريخ التحديث</span>
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>الاسم</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Box className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <Box className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {selectedModel ? (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedModel(null)}
                className="text-blue-600 hover:text-blue-700"
              >
                العودة للنماذج
              </button>
              <h3 className="font-medium">{selectedModel.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div ref={canvasRef} className="h-[500px]" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedModels.map((model) => (
            <div
              key={model.id}
              className="bg-white rounded-xl border hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedModel(model)}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-xl">
                <img
                  src={model.thumbnail}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium mb-1">{model.name}</h3>
                  <p className="text-white/80 text-sm">{model.discipline}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                    {getStatusLabel(model.status)}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{model.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{model.collaborators} مشاركين</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border divide-y">
          {sortedModels.map((model) => (
            <div
              key={model.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedModel(model)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={model.thumbnail}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{model.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{model.discipline}</span>
                      <span>•</span>
                      <span>v{model.version}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{model.lastUpdated}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{model.collaborators} مشاركين</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                    {getStatusLabel(model.status)}
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
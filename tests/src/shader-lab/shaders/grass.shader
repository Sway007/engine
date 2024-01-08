Shader "Glass.shader" {
    EditorProperties {
      u_color("Main Color", Color) = (1, 0, 0, 1);
      u_texture("Main Texture", Texture2D);
      u_GlassRef("IOR", Range(0, 2, 0.1)) = 1.02;
      u_RefStrength("Refract Strength", Range(0, 10, 0.1)) = 1.0;
      u_RefOffest("Refract Offest", Range(0, 10, 0.1)) = 1.0;
      u_RefFresnel("Fresnel Reflect", Range(0, 1, 0.1)) = 0.04;
      u_PowFresnel("Fresnel Power", Range(0, 10, 0.1)) = 5;
      u_thickness("Thickness", Range(0, 10, 0.1)) = 1;
      u_cubemap("Cube Texture", TextureCube);
    }
    SubShader "Default" {
      Pass "Pass0" {
        mat4 renderer_MVPMat;
        vec3 camera_Position;
        vec4 u_color;
        float u_GlassRef;
        float u_RefFresnel;
        float u_PowFresnel;
        float u_thickness;
        sampler2D u_texture;
        samplerCube u_cubemap;
  
        struct a2v {
          vec4 POSITION;
          vec3 NORMAL;
          vec2 TEXCOORD_0;
        }
  
        struct v2f {
          vec3 v_pos;
          vec3 v_normal;
          vec2 v_uv;

        }
  
        VertexShader = vert;
        FragmentShader = frag;

        float Fresnel(vec3 viewDir, vec3 normal)
         {
          float cosTheta = clamp(dot(viewDir, normal), 0.0, 1.0);
          return u_RefFresnel.r + (1.0 - u_RefFresnel.r) * pow(1.0 - cosTheta, fresnelPower);
         }

        v2f vert(a2v v) {
          v2f o;
  
          gl_Position = renderer_MVPMat  *  v.POSITION;
          o.v_pos =  v.POSITION.xyz;
          o.v_normal = v.NORMAL;
          o.v_uv = v.TEXCOORD_0;
          return o;
        }
  
        void frag(v2f i) {
         vec3 WorldPos = i.v_pos; 
         vec3 N = normalize(i.v_normal);
         vec3 V = normalize(WorldPos - camera_Position);

         vec3 ReflectDir = reflect(V, N);
         vec4 ReflectColor = textureCube(u_cubemap, ReflectDir);

         vec3 RefractDir = refract(V, N, 1.0/u_GlassRef);

         float fresnel = Fresnel(V, N);
         //vec3 refractionTex =  refractDir * u_RefOffest * fresnel * thickness;

         //vec4 refractColor = textureCube(u_cubemap, refractionTex);
         //vec4 finalColor = mix(refractColor * (1.0 - u_RefStrength) + reflectColor * u_RefStrength, reflectColor, fresnel * fresnelMixStrength);

          gl_FragColor = texture2D(u_texture, i.v_uv) * u_color;
          }
        }
      }
    }
# Stack Tecnológico - BuscaVivaMT

## 🎯 Visão Geral

Este documento detalha todas as tecnologias utilizadas no projeto BuscaViva e as justificativas para cada escolha.

## 📊 Stack Principal

### Frontend Framework
|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
|      **React**      |     18.2.0    | - Requisito do projeto<br>- Componentização eficiente<br>- Grande ecossistema<br>- Virtual DOM para performance |
|    **TypeScript**   |     5.0.0     | - Type safety<br>- Melhor manutenibilidade<br>- IntelliSense avançado<br>- Redução de bugs                      |

### Build & Development
|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
|      **Vite**       |     4.4.0     | - HMR ultrarrápido<br>- Build otimizado<br>- Suporte nativo TypeScript<br>- Melhor DX que CRA                   |
|      **SWC**        |     Latest    | - Compilação mais rápida<br>- Drop-in replacement para Babel                                                    |

### Estilização
|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
|   **Tailwind CSS**  |     3.3.0     | - Utility-first<br>- Desenvolvimento rápido<br>- Consistência visual<br>- PurgeCSS integrado                    |
|    **PostCSS**      |     8.4.0     | - Autoprefixer<br>- Otimizações CSS<br>- Suporte a plugins                                                      |

### Gerenciamento de Estado
|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
| **TanStack Query**  |     4.32.0    | - Cache inteligente<br>- Sincronização servidor<br>- Retry automático<br>- Optimistic updates                   |
|   **Context API**   |    Built-in   | - Estado global simples<br>- Nativo do React<br>- Sem deps extras                                               |

### Roteamento
|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
|  **React Router**   |     6.14.0    | - Padrão de mercado<br>- Lazy loading<br>- Nested routes<br>- Type-safe                                         |

### Formulários
|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
| **React Hook Form** |     7.45.0    | - Performance<br>- Menos re-renders<br>- Validação built-in<br>- TypeScript support                             |
|     **Zod**         |     3.21.0    | - Schema validation<br>- Type inference<br>- Composable<br>- Error messages                                     |

### HTTP Client
|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
|     **Axios**       |     1.4.0     | - Interceptors<br>- Transform requests<br>- Cancel requests<br>- Progress tracking                              |

### Mapas
|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
|     **Leaflet**     |     1.9.4     | - Open source<br>- Leve<br>- Mobile-friendly<br>- Extensível                                                    |
| **React Leaflet**   |     4.2.1     | - React components<br>- Hooks support<br>- TypeScript ready                                                     |

## 🧪 Testing

|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
|    **Vitest**       |     0.34.0    | - Vite nativo<br>- Jest compatible<br>- Fast<br>- ESM support                                                   |
| **Testing Library** |     14.0.0    | - User-centric<br>- Best practices<br>- Accessibility<br>- React official                                       |
|      **MSW**        |     1.2.0     | - API mocking<br>- Service worker<br>- Network level<br>- Dev & test                                            |
|    **Cypress**      |     12.17.0   | - E2E testing<br>- Visual testing<br>- Real browser<br>- CI friendly |

## 📦 Utilitários

|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
|    **date-fns**     |     2.30.0    | - Modular<br>- Tree-shaking<br>- Immutable<br>- i18n support                                                    |
| **react-hot-toast** |     2.4.1     | - Lightweight<br>- Customizable<br>- Promise API<br>- Accessible                                                |
|   **lucide-react**  |     0.263.0   | - Tree-shakable icons<br>- TypeScript<br>- Customizable<br>- Consistent                                         |

## 🔧 DevOps & Tools

|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
|     **Docker**      |    Latest     | - Containerização<br>- Consistency<br>- Portability<br>- Scalability                                            |
| **GitHub Actions**  |       -       | - CI/CD nativo<br>- Free for public<br>- YAML config<br>- Marketplace                                           |
|     **ESLint**      |    8.45.0     | - Code quality<br>- Consistency<br>- Catch errors<br>- Auto-fix                                                 |
|    **Prettier**     |    3.0.0      | - Code formatting<br>- Consistency<br>- Auto-format<br>- Team standard                                          |
|     **Husky**       |    8.0.0      | - Git hooks<br>- Pre-commit<br>- Quality gates<br>- Automation                                                  |

## 📈 Analytics & Monitoring

|     Tecnologia      |     Versão    |                                       Justificativa                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
| **Google Analytics**|      GA4      | - Free tier<br>- Comprehensive<br>- Real-time<br>- Goals tracking                                               |
|     **Sentry**      |     Latest    | - Error tracking<br>- Performance<br>- Real user monitoring<br>- Alerts                                         |

## 🎯 Decisões Importantes

### Por que NÃO usamos:

❌ **Redux**
- Complexidade desnecessária para o escopo
- TanStack Query resolve server state
- Context API suficiente para client state

❌ **Styled Components/Emotion**
- Bundle size maior
- Runtime overhead
- Tailwind mais eficiente

❌ **Create React App**
- Deprecated/não mantido
- Vite mais rápido
- Melhor DX

❌ **Material-UI/Ant Design**
- Bundle size grande
- Menos customização
- Design próprio necessário

## 📋 Compatibilidade

### Browsers Suportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔄 Atualizações

Este documento deve ser atualizado sempre que:
- Nova tecnologia for adicionada
- Versão major for atualizada
- Tecnologia for removida
- Justificativa mudar


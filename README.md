# Calculadora de Divisas BCV

Una calculadora de divisas estática que utiliza las tasas oficiales del Banco Central de Venezuela (BCV) para convertir USD/EUR a VES y viceversa. El proyecto está optimizado para GitHub Pages y utiliza GitHub Actions para actualizaciones automáticas diarias.

## 🚀 Demo

Puedes ver la aplicación funcionando en: `https://[TU-USUARIO].github.io/[NOMBRE-REPO]`

## 📋 Características

- Conversión en tiempo real entre USD, EUR y VES
- Selección de fecha para consultar tasas históricas
- Interfaz mobile-first, ligera y optimizada para móviles
- Actualización automática diaria de tasas mediante GitHub Actions
- Sin backend en tiempo real - utiliza datos estáticos JSON

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
Calculadora-BCV/
├── index.html          # Estructura HTML de la calculadora
├── styles.css          # Estilos CSS mobile-first
├── app.js              # Lógica de la calculadora y consumo del JSON
├── README.md           # Este archivo de documentación
├── data/
│   └── rates.json      # Base de datos de tasas históricas (YYYY-MM-DD: {USD, EUR})
├── scripts/
│   ├── update_bcv.py   # Script de scraping del BCV en Python
│   └── requirements.txt # Dependencias de Python
└── .github/
    └── workflows/
        └── daily_update.yml  # Workflow de GitHub Actions
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Mobile-first, sin frameworks (Sass, Bootstrap, etc.)
- **Vanilla JavaScript**: Sin frameworks ni librerías externas

### Backend/Automatización
- **Python 3.11**: Script de scraping
- **requests**: Consultas HTTP
- **BeautifulSoup4**: Parsing del HTML
- **GitHub Actions**: Automatización de actualización

## 📦 Requisitos Previos

1. **GitHub Account**: Cuenta con permisos para crear repositorios
2. **Python 3.11+** (solo si necesitas probar el script localmente)
3. **Conocimientos básicos de Git**: Para configurar el repositorio

## 🚀 Cómo Desplegar en GitHub Pages

### Paso 1: Crear el repositorio

```bash
# 1. Crea un nuevo repositorio en GitHub
# 2. Clona el repositorio vacío
git clone https://github.com/[TU-USUARIO]/[NOMBRE-REPO].git

# 3. Copia los archivos del proyecto
#    (index.html, styles.css, app.js, data/, scripts/, .github/)

# 4. Comitea los archivos
git add .
git commit -m "Inicializar calculadora de divisas BCV"

# 5. Push al repositorio
git push origin main
```

### Paso 2: Habilitar GitHub Pages

1. Ve a **Settings** → **Pages** de tu repositorio
2. En "Source", selecciona:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Guarda los cambios
4. GitHub generará una URL como: `https://[TU-USUARIO].github.io/[NOMBRE-REPO]`

### Paso 3: Verificar el funcionamiento

1. Descarga: Espera unos segundos a que GitHub Pages despliegue los archivos
2. Abre la URL en tu navegador
3. La calculadora debería cargarse con la fecha actual y poder realizar conversiones

## ⚙️ Configuración de GitHub Actions

### Permisos necesarios

El workflow requiere permiso de escritura para actualizar el archivo `data/rates.json`. Asegúrate de que el token `GITHUB_TOKEN` tenga estos permisos:

```yaml
permissions:
  contents: write
```

### Programación de ejecución

El workflow está configurado para ejecutarse:
- **Horario**: Lunes a Viernes a las 16:00 VET (20:00 UTC)
- **Cron**: `cron: '0 20 * * 1-5'`

Este horario coincide con la actualización oficial del BCV.

### Personalización del Workflow

Puedes modificar la programación en `.github/workflows/daily_update.yml`:

```yaml
on:
  schedule:
    - cron: '0 20 * * 1-5'  # Formato: minuto hora día-mes día-semana
```

## 🔧 Modo Desarrollo Local

### Ver la aplicación localmente

```bash
# 1. Navega al directorio del proyecto
cd Calculadora-BCV

# 2. Sirve los archivos con un servidor local (ejemplo con Python)
python -m http.server 8000

# 3. Abre tu navegador en http://localhost:8000
```

### Probar el script de scraping localmente

```bash
# 1. Instala las dependencias
pip install -r scripts/requirements.txt

# 2. Ejecuta el script
python scripts/update_bcv.py

# 3. Verifica que data/rates.json se haya actualizado
cat data/rates.json
```

## 📊 Estructura de datos (rates.json)

```json
{
    "2026-08-01": {
        "USD": 36.50,
        "EUR": 39.10
    },
    "2026-08-02": {
        "USD": 36.75,
        "EUR": 39.35
    }
}
```

**Formato:**
- **Llaves**: Fechas en formato `YYYY-MM-DD`
- **Valores**: Objeto con tasas de cambio para cada moneda (en VES por unidad)

## 🤖 Funcionamiento de la Lógica (app.js)

### Flux de datos

```
1. DOMContentLoaded → loadRates()
2. loadRates() → fetch('data/rates.json')
3. ratesData = {fechas: {USD, EUR}}
4. findClosestRate(fechaSeleccionada)
5. updateRateDisplay() → currentRate = rates[moneda]
6. calculate() → amountTo = amountFrom * currentRate
```

### Manejo de errores

1. **Fecha no disponible**: Busca la tasa más cercana y muestra advertencia
2. **Error de carga**: Muestra mensaje de error amigable
3. **Validación de inputs**: Solo permite números positivos

## 🔄 Cómo funciona el inversor de divisas

```javascript
// Al hacer clic en el botón de swap:
function swap() {
    isReverse = !isReverse;
    // Intercambia currencyFrom ↔ currencyTo
    // Mantiene amountFrom editable, amountTo readonly
    // Calcula inversa automáticamente
}
```

## 📝 Personalización

### Cambiar estilo del tema

Edita `styles.css` y modifica:
- Colores en variables de color
- Tipografías en `font-family`
- Espaciado en `padding` y `margin`

### Agregar nuevas monedas

1. Modifica `data/rates.json` para incluir la nueva moneda:
   ```json
   {
       "2026-08-01": {
           "USD": 36.50,
           "EUR": 39.10,
           "OTH": 45.00
       }
   }
   ```

2. Agrega opción en `select` del HTML:
   ```html
   <option value="OTH">Otra Moneda</option>
   ```

### Modificar el scraper

Edita `scripts/update_bcv.py` para:
- Cambiar selectores de BeautifulSoup
- Agregar manejo de nuevas monedas
- Modificar formato de salida

## 🐛 Solución de Problemas

### La tasa no se actualiza

1. Verifica que GitHub Actions se ejecutó: **Actions** → **Daily BCV Rate Update**
2. Revisa los logs del workflow para errores específicos
3. Asegúrate que `data/rates.json` tiene permisos de escritura

### GitHub Pages no carga la app

1. Verifica que el archivo `index.html` está en la raíz del repositorio
2. En Settings → Pages, confirma que la rama es `main` y carpeta es `/`
3. Espera 1-2 minutos a que GitHub procese los archivos

### Error de SSL en el scraping

El script ya incluye manejo de SSL con `verify=False`. Si persiste, puedes:
1. Agregar excepción de certificado en el sistema
2. Usar una VPN o proxy diferente

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios
4. Haz commit: `git commit -m "Agregar nueva funcionalidad"`
5. Push: `git push origin feature/nueva-funcionalidad`
6. Crea un Pull Request

## 📜 Estructura detallada para agentes de IA / Desarrolladores

### Archivo: index.html

**Propósito**: Estructura visual de la calculadora

**Elementos principales**:
- `<meta name="viewport">`: Mobile-first responsive
- `<input type="date" id="date">`: Selector de fecha predeterminado al día actual
- `<select id="currency">`: Selector USD/EUR
- `<button id="swapBtn">`: Ícono SVG para invertir conversión
- `<input id="amountFrom">`: Campo numérico editable (origen)
- `<input id="amountTo">`: Campo numérico readonly (destino)
- `<small id="rateLabel">`: Muestra tasa del día

**IDs de elementos para JS**:
```
date          → #date
currency      → #currency
swap button   → #swapBtn
amount from   → #amountFrom
amount to     → #amountTo
rate label    → #rateLabel

labels:
currency from → #currencyFrom
currency to   → #currencyTo
```

### Archivo: styles.css

**Principios de diseño**:
- Mobile-first: Diseño responsive del 100%
- Sin frameworks: CSS puro con variables de color
- Mobile: 480px max-width

**Clases principales**:
- `.container`: Contenedor principal con sombra
- `.input-group`: Grupo de inputs con flexbox
- `.form-group`: Margen entre elementos
- `.swap-btn`: Botón circular hoverable

### Archivo: app.js

**Variables globales**:
```javascript
ratesData    // Objeto con todas las tasas históricas
isReverse    // Boolean: false=USD→VES, true=VES→USD
currentRate  // Número: tasa actual seleccionada
```

**Funciones principales**:
1. `loadRates()`: Fetch async de rates.json
2. `findClosestRate(date)`: Búsqueda de tasa por fecha
3. `updateRateDisplay(data)`: Actualiza UI y rateLabel
4. `calculate()`: Cálculo automático VES ↔ moneda
5. `swap()`: Inversión de conversión

**Event listeners**:
- `dateInput` → change → findClosestRate + updateRateDisplay
- `currencySelect` → change → findClosestRate + updateRateDisplay
- `swapBtn` → click → swap
- `amountFrom` → input → calculate

### Archivo: data/rates.json

**Formato requerido**: Objeto con llaves de fecha YYYY-MM-DD
```json
{
    "YYYY-MM-DD": {
        "USD": number,
        "EUR": number
    }
}
```

### Archivo: scripts/update_bcv.py

**Flujo de scraping**:
1. `fetch_exchange_rates()` → GET a bcv.org.ve
2. Parse HTML con BeautifulSoup
3. Extraer valores numéricos de USD y EUR
4. Guardar en rates.json con fecha actual (Caracas timezone)

**Manejo de errores**:
- Fallback a valores por defecto si falla el scraping
- Excepciones atrapadas para JSONDecodeError

### Archivo: scripts/requirements.txt

**Dependencias**:
- requests>=2.28.0
- beautifulsoup4>=4.9.3

### Archivo: .github/workflows/daily_update.yml

**Jobs**:
```
update-rates
├── checkout
├── setup-python
├── install-dependencies
├── run-scraper
├── configure-git
└── commit-push (solo si hay cambios)
```

**Trigger**: schedule (cron) + workflow_dispatch (manual)

## 📞 Contacto / Soporte

Para dudas técnicas o reporte de bugs, crea un issue en el repositorio.

## 📄 Licencia

Este proyecto está bajo licencia libre para uso personal y comercial.
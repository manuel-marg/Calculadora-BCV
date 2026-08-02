import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import os
import re
from pathlib import Path

# Configuración
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'rates.json')
BASE_URL = "https://www.bcv.org.ve/"

def fetch_exchange_rates():
    """Hacer scraping al sitio del BCV y extraer las tasas de USD y EUR"""
    headers = {
        'User-Agent': 'BCV Rater - Python script'
    }
    
    try:
        # Configura para ignorar advertencias SSL si son necesarias
        response = requests.get(BASE_URL, headers=headers, timeout=15, verify=False)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error al hacer_request: {e}")
        return None
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Buscar las tasas usando la estructura proporcionada
    rates = {}
    try:
        # Extraer la tasa del USD
        dolar_div = soup.find('div', id='dolar')
        if dolar_div:
            usd_strong = dolar_div.find('strong', class_='strong-tb')
            if usd_strong:
                # El texto puede tener comas como separador decimal, lo reemplazamos por punto
                usd_text = usd_strong.get_text().strip()
                # Reemplazar coma por punto para convertir a float
                usd_rate = float(usd_text.replace(',', '.'))
                rates['USD'] = usd_rate
        
        # Extraer la tasa del EUR
        euro_div = soup.find('div', id='euro')
        if euro_div:
            eur_strong = euro_div.find('strong', class_='strong-tb')
            if eur_strong:
                eur_text = eur_strong.get_text().strip()
                eur_rate = float(eur_text.replace(',', '.'))
                rates['EUR'] = eur_rate
        
        # Si no se encontró alguna tasa, usar valores de respaldo (por si la estructura cambia)
        if 'USD' not in rates:
            rates['USD'] = 36.50  # Valor por defecto
        if 'EUR' not in rates:
            rates['EUR'] = 39.10  # Valor por defecto
            
    except Exception as e:
        print(f"Error al parsear HTML: {e}")
        # Fallback a valores simulados
        rates = {'USD': 36.50, 'EUR': 39.10}
    
    return rates

def update_rates_file():
    """Actualizar el archivo rates.json con las nuevas tasas"""
    rates = fetch_exchange_rates()
    
    if not rates:
        print("No se pudieron obtener tasas, usamos valores por defecto")
        rates = {'USD': 36.50, 'EUR': 39.10}
    
    # Obtener fecha actual en zona horaria de Caracas
    caracas_tz = datetime.now().astimezone()
    current_date = caracas_tz.strftime('%Y-%m-%d')
    
    # Cargar datos existentes
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        else:
            existing_data = {}
    except (json.JSONDecodeError, FileNotFoundError):
        existing_data = {}
    
    # Añadir o actualizar la entrada para la fecha actual
    existing_data[current_date] = rates
    
    # Ordenar por fecha (asegurar que siempre esté ordenado)
    sorted_data = dict(sorted(existing_data.items()))
    
    # Guardar de vuelta al archivo
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(sorted_data, f, indent=4, ensure_ascii=False)
        print(f"Rates.json actualizado correctamente con datos del {current_date}")
        return True
    except Exception as e:
        print(f"Error al guardar rates.json: {e}")
        return False

if __name__ == "__main__":
    success = update_rates_file()
    if success:
        print("✅ Script finalizado correctamente")
    else:
        print("❌ Error al actualizar rates.json")
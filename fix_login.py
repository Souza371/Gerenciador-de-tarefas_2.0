with open("web/index-novo.html", "r") as f:
    t = f.read()

if "Contas de Teste" not in t:
    t = t.replace("</form>\n      </div>", """</form>
        <div class="login-footer">
          <p><b>Contas de Teste Rápidas (Clique aqui para preencher):</b></p>
          <div class="accounts-grid" style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 10px; font-size: 11px; text-align: left; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px;">
            <small onclick="document.getElementById('email').value='vicentedesouza762@gmail.com'; document.getElementById('password').value='Admin@2026';" style="cursor: pointer; padding: 6px; border-radius: 4px; background: rgba(255,255,255,0.8); border: 1px solid #ccc; color: #333;">👑 <b>Vicente (Admin):</b> vicente... / Admin@2026</small>
            <small onclick="document.getElementById('email').value='francisco@projeto.com'; document.getElementById('password').value='Admin@2026';" style="cursor: pointer; padding: 6px; border-radius: 4px; background: rgba(255,255,255,0.8); border: 1px solid #ccc; color: #333;">🎩 <b>Francisco (Admin):</b> francisco... / Admin@2026</small>
            <small onclick="document.getElementById('email').value='engenheiroteste@projeto.com'; document.getElementById('password').value='Engenheiro@123';" style="cursor: pointer; padding: 6px; border-radius: 4px; background: rgba(255,255,255,0.8); border: 1px solid #ccc; color: #333;">👷‍♂️ <b>Engenheiro:</b> engenheiro... / Engenheiro@123</small>
          </div>
        </div>
      </div>""")
    with open("web/index-novo.html", "w") as f:
        f.write(t)

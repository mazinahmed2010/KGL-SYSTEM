<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Company Info -->
      <div class="footer-section">
        <div class="logo-container">
          <img src="/KGL-LOGO.png" alt="KGL Logo" class="footer-logo">
          <h3>Karibu Groceries Ltd</h3>
        </div>
        <p class="company-desc">
          
        </p>
        <div class="social-links">
          <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
          <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
          <a href="#" class="social-link"><i class="fab fa-whatsapp"></i></a>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul class="footer-links">
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/inventory">Inventory</router-link></li>
          <li><router-link to="/sales">Sales</router-link></li>
          <li><router-link to="/credit">Credit Sales</router-link></li>
          <li><router-link to="/procurement">Procurement</router-link></li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div class="footer-section">
        <h4>Contact Us</h4>
        <ul class="contact-info">
          <li>
            <i class="fas fa-map-marker-alt"></i>
            <span>Maganjo: Plot 12, Kampala Road</span>
          </li>
          <li>
            <i class="fas fa-map-marker-alt"></i>
            <span>Matugga: Plot 45, Matugga Town</span>
          </li>
          <li>
            <i class="fas fa-phone"></i>
            <span>+256 700 123 456 (Maganjo)</span>
          </li>
          <li>
            <i class="fas fa-phone"></i>
            <span>+256 700 789 012 (Matugga)</span>
          </li>
          <li>
            <i class="fas fa-envelope"></i>
            <span>info@kgl.co.ug</span>
          </li>
        </ul>
      </div>

      <!-- Newsletter -->
      <div class="footer-section">
        <h4>Newsletter</h4>
        <p>Subscribe for updates and offers</p>
        <div class="newsletter-form">
          <input type="email" placeholder="Your email" v-model="email">
          <button @click="subscribe"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Karibu Groceries Ltd. All rights reserved.</p>
      <div class="footer-bottom-links">
        <router-link to="/privacy">Privacy</router-link>
        <span class="separator">|</span>
        <router-link to="/terms">Terms</router-link>
        <span class="separator">|</span>
        <router-link to="/sitemap">Sitemap</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const email = ref('')
const toast = useToast()
const currentYear = new Date().getFullYear()

const subscribe = () => {
  if (!email.value) {
    toast.warning('Please enter your email')
    return
  }
  toast.success('Subscribed successfully!')
  email.value = ''
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, var(--deep-green), var(--dark-green));
  color: white;
  margin-top: 50px;
  border-top: 4px solid var(--gold);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section h3, .footer-section h4 {
  color: var(--gold);
  margin-bottom: 20px;
}

.footer-logo {
  height: 100px;
  margin-bottom: 15px;
  filter:  brightness(0) saturate(100%) invert(82%) sepia(45%) saturate(1000%) hue-rotate(0deg) brightness(105%) contrast(105%);
  animation: glowPulse 3s infinite ease-in-out;
}

.company-desc {
  color: rgba(255,255,255,0.8);
  line-height: 1.6;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 10px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255,215,0,0.1);
  border-radius: 50%;
  color: var(--gold);
  transition: all 0.3s;
}

.social-link:hover {
  background: var(--gold);
  color: var(--deep-green);
  transform: translateY(-3px);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--gold);
  padding-left: 5px;
}

.contact-info {
  list-style: none;
  padding: 0;
}

.contact-info li {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  color: rgba(255,255,255,0.8);
  font-size: 14px;
}

.contact-info i {
  color: var(--gold);
  width: 20px;
  margin-top: 3px;
}

.newsletter-form {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.newsletter-form input {
  flex: 1;
  padding: 10px;
  border: 2px solid rgba(255,215,0,0.3);
  border-radius: 5px;
  background: rgba(255,255,255,0.1);
  color: white;
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--gold);
}

.newsletter-form button {
  background: var(--gold);
  color: var(--deep-green);
  border: none;
  width: 40px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.newsletter-form button:hover {
  background: #e6c200;
  transform: scale(1.05);
}

.footer-bottom {
  background: var(--dark-green);
  padding: 20px;
  text-align: center;
  border-top: 1px solid rgba(255,215,0,0.2);
}

.footer-bottom p {
  color: rgba(255,255,255,0.6);
  margin-bottom: 10px;
}

.footer-bottom-links {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-size: 13px;
}

.footer-bottom-links a {
  color: rgba(255,255,255,0.6);
  text-decoration: none;
}

.footer-bottom-links a:hover {
  color: var(--gold);
}

.separator {
  color: rgba(255,215,0,0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .contact-info li {
    justify-content: center;
  }
  
  .newsletter-form {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
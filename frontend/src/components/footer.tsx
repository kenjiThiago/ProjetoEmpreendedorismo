import { motion } from "framer-motion"
import {
  ArrowRight,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react"
// import Image from "next/image"

export function Footer() {
  const quickLinks = [
    { name: "Sobre o DevStart", href: "#" },
    { name: "Como Funciona", href: "#" },
    { name: "Para Estudantes", href: "#" },
    { name: "Para Empresas", href: "#" },
    { name: "Blog", href: "#" },
  ]

  // const categories = [
  //   { name: "Frontend", href: "#" },
  //   { name: "Backend", href: "#" },
  //   { name: "Mobile", href: "#" },
  //   { name: "DevOps", href: "#" },
  //   { name: "Data Science", href: "#" },
  // ]

  const support = [
    { name: "Central de Ajuda", href: "#" },
    { name: "Termos de Uso", href: "#" },
    { name: "Política de Privacidade", href: "#" },
    { name: "FAQ Estudantes", href: "#" },
    { name: "FAQ Empresas", href: "#" },
  ]

  const socialLinks = [
    { icon: Github, href: "#", color: "hover:text-gray-300" },
    { icon: Twitter, href: "#", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", color: "hover:text-pink-400" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-500" },
    { icon: Youtube, href: "#", color: "hover:text-red-500" },
  ]

  return (
    <footer className="relative overflow-hidden border-gray-800/50 border-t bg-gray-950">
      {/* Simplified Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <motion.div
          className="border-gray-800/50 border-b py-12"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="mb-4 font-bold text-2xl text-white md:text-3xl">
              Vagas e <span className="gradient-text">Dicas Dev</span>
            </h3>
            <p className="mb-8 text-gray-400">
              Receba dicas de carreira, novas tecnologias e os últimos projetos
              postados na plataforma.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/50 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-colors duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  placeholder="dev@exemplo.com"
                  type="email"
                />
              </div>
              <button
                className="btn-primary flex items-center space-x-2 px-6"
                type="button"
              >
                <Send className="h-4 w-4" />
                <span>Inscrever</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="group mb-6 flex items-center space-x-3">
                <div className="relative">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
                    <img
                      alt="DevStart Logo"
                      className="rounded-full object-cover"
                      height={40}
                      src="/logo-codify.png"
                      width={40}
                    />
                    {/* Simplified shine effect */}
                    <div className="-translate-x-full absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  </div>
                </div>
                <h3 className="gradient-text font-bold text-2xl">DevStart</h3>
              </div>

              <p className="mb-6 max-w-md text-gray-400 leading-relaxed">
                A ponte entre estudantes de TI e PMEs. Conectamos talento
                universitário a projetos reais para construir portfólios de
                impacto.
              </p>

              {/* Contact Info */}
              <div className="mb-6 space-y-3">
                <div className="flex cursor-pointer items-center text-gray-400 transition-colors hover:text-white">
                  <Phone className="mr-3 h-4 w-4" />
                  <span>+55 (11) 9999-9999</span>
                </div>
                <div className="flex cursor-pointer items-center text-gray-400 transition-colors hover:text-white">
                  <Mail className="mr-3 h-4 w-4" />
                  <span>contato@devstart.com.br</span>
                </div>
                <div className="flex cursor-pointer items-center text-gray-400 transition-colors hover:text-white">
                  <MapPin className="mr-3 h-4 w-4" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 ${social.color} hover:-translate-y-1 transition-all duration-300 hover:scale-110 hover:bg-gray-700`}
                      href={social.href}
                      key={index}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-6 font-semibold text-lg text-white">
                Navegação
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      className="group flex items-center text-gray-400 transition-colors duration-200 hover:text-orange-400"
                      href={link.href}
                    >
                      <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-6 font-semibold text-lg text-white">Suporte</h4>
              <ul className="space-y-3">
                {support.map((item, index) => (
                  <li key={index}>
                    <a
                      className="group flex items-center text-gray-400 transition-colors duration-200 hover:text-orange-400"
                      href={item.href}
                    >
                      <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="border-gray-800/50 border-t py-8"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="mb-4 text-center text-gray-400 md:mb-0 md:text-left">
              &copy; 2025 DevStart. Todos os direitos reservados.
            </p>

            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <span className="flex items-center">
                Feito com <span className="mx-1 text-red-500">❤</span> por devs,
                para devs
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-orange-500 via-red-500 to-blue-600" />
    </footer>
  )
}

  import { motion, AnimatePresence } from "framer-motion";

  export default function Toast({ message }) {
    return (
      <AnimatePresence>
        {message && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 right-5 bg-[#4b2300] text-white sm:text-base text-xs px-4 py-2 rounded shadow-lg z-50"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

import Swal from 'sweetalert2';

export const showConfirmDelete = async (itemName: string = "cet élément") => {
  const result = await Swal.fire({
    title: 'Confirmation de suppression',
    html: `
      <div style="text-align: left">
        <p>Êtes-vous sûr de vouloir supprimer ${itemName} ?</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#94CCFB',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    background: 'white',
    color: '#020339'
  });
  return result.isConfirmed;
};

export const showSuccess = async (message: string) => {
  await Swal.fire({
    icon: 'success',
    title: 'Succès !',
    text: message,
    confirmButtonColor: '#020339',
    timer: 1000,
    showConfirmButton: false
  });
};

export const showError = async (message: string) => {
  await Swal.fire({
    icon: 'error',
    title: 'Erreur !',
    text: message,
    confirmButtonColor: '#d33'
  });
};

// Chargement
export const showLoading = async (message: string = "Traitement en cours...") => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Fermer Swal
export const closeSwal = () => {
  Swal.close();
};

// notification
export const showToast = (icon: 'success' | 'error' | 'warning' | 'info', message: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  
  Toast.fire({
    icon: icon,
    title: message,
    background: icon === 'success' ? '#10b98120' : icon === 'error' ? '#ef444420' : '#94CCFB20',
    color: icon === 'success' ? '#10b981' : icon === 'error' ? '#ef4444' : '#020339'
  });
};
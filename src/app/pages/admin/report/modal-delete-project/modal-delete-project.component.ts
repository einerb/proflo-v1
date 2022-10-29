import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-modal-delete-project',
  templateUrl: './modal-delete-project.component.html',
  styleUrls: ['./modal-delete-project.component.scss']
})
export class ModalDeleteProjectComponent implements OnInit {
  public projects: any[] = [];

  constructor(private readonly projectService: ProjectService) { }

  ngOnInit(): void {
    this.getAllProjects();
  }


  public delete(id: number) {
    Swal.fire({
      title: `Operación delicada`,
      text: "Está a punto de realizar una operación irreversible. ¿Está seguro que desea continuar?",
      icon: 'warning',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.delete(id).subscribe((res: any) => {
          Swal.fire(
            'Eliminado!',
            res.message,
            'success'
          ).then(() => {
            this.getAllProjects();
          })
        });
      }
    });

  }

  private getAllProjects() {
    this.projectService.getAll().subscribe((res: any) => {
      this.projects = res.data;
    });
  }




}

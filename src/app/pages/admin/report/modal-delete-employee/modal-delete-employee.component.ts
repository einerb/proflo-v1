import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { EmployeeService } from 'src/app/services';

@Component({
  selector: 'app-modal-delete-employee',
  templateUrl: './modal-delete-employee.component.html',
  styleUrls: ['./modal-delete-employee.component.scss']
})
export class ModalDeleteEmployeeComponent implements OnInit {
  public employees: any[] = [];

  constructor(private readonly employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getAllEmployees();
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
        this.employeeService.delete(id).subscribe((res: any) => {
          Swal.fire(
            'Eliminado!',
            res.message,
            'success'
          ).then(() => {
            this.getAllEmployees();
          })
        });
      }
    });

  }

  private getAllEmployees() {
    this.employeeService.getAllEmployee().subscribe((res: any) => {
      this.employees = res.data;
    });
  }




}

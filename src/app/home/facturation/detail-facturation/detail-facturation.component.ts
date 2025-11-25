import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../service/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-facturation',
  standalone: true,
  imports: [],
  templateUrl: './detail-facturation.component.html',
  styleUrl: './detail-facturation.component.scss'
})
export class DetailFacturationComponent {
  loading_get_detail_facturation: boolean =false;
  details: any;
  id_facturation: number = 0
 constructor(public api: ApiService,private modalService: NgbModal,private router: Router,private a_route: ActivatedRoute) {
   a_route.params.subscribe((params: any) => {
      console.log(params)
      if (params["id_facturation"]) {
        this.id_facturation = params["id_facturation"]
       
      }
    })
     console.log('id_facturation du constructeur',this.id_facturation)
    }
    ngOnInit(): void {
      console.groupCollapsed("DetailFacturationComponent");
      console.log("id de la facture", this.id_facturation)
       this.get_facturation()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_facturation() {
      this.loading_get_detail_facturation = true;
      this.api.taf_post_object("facturation/get_one", {id_facturation:this.id_facturation}, (reponse: any) => {
        if (reponse.status) {
          this.details = reponse.data
          console.log("details de la facture séléctionnés=", this.details);
          console.log("Opération effectuée avec succés sur la table facturation. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table facturation a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_detail_facturation = false;
      }, (error: any) => {
        this.loading_get_detail_facturation = false;
      })
    }

}  


import { Component, OnDestroy, OnInit } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddGenreComponent } from '../add-genre/add-genre.component';
  import { EditGenreComponent } from '../edit-genre/edit-genre.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
import { GenreTafType } from '../taf-type/genre-taf-type';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-genre',
    standalone: true, // Composant autonome
    imports: [FormsModule,NgSelectModule], // Dépendances importées
    templateUrl: './list-genre.component.html',
    styleUrls: ['./list-genre.component.scss']
  })
  export class ListGenreComponent implements OnInit, OnDestroy{
    loading_get_genre = false
    loading_delete_genre = false
    les_genres: GenreTafType[] = []
    list: GenreTafType[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListGenreComponent");
      this.get_genre()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_genre() {
      this.loading_get_genre = true;
      this.api.taf_post("genre/get", {}, (reponse: any) => {
        if (reponse.status) {
          this.les_genres = reponse.data
          console.log("Opération effectuée avec succés sur la table genre. Réponse= ", reponse);
          this.filter_change();
        } else {
          console.log("L'opération sur la table genre a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_genre = false;
      }, (error: any) => {
        this.loading_get_genre = false;
      })
    }
    filter_change(event?: any) {
      this.list = this.les_genres.filter((one: any) => {
        let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
          .includes(event?.term?.toLowerCase().replace(/s/g, ''))
        // filtre complexe
        // let filtre_objet: any = {}
        // let text = !this.filter.text || this.filter.text.length == 0
        //   || this.filter.text.filter((one_filtre: string) => {
        //     let domaine = !one_filtre.startsWith('domaine_') || (one_filtre.startsWith('domaine_') && one_filtre.replace('domaine_', '') == one.id_domaine)
        //     let zone = !one_filtre.startsWith('zone_') || (one_filtre.startsWith('zone_') && one_filtre.replace('zone_', '') == one.id_zone)

        //     // Incrémenter les compteurs
        //     if (one_filtre.startsWith('domaine_')) filtre_objet.domaine_ = (filtre_objet.domaine_ || 0) + 1
        //     if (one_filtre.startsWith('zone_')) filtre_objet.zone_ = (filtre_objet.zone_ || 0) + 1
        //     return domaine && zone
        //   }).length >= Object.keys(filtre_objet).length

        return search// && text
      })
    }
    delete_genre (genre : any){
      this.loading_delete_genre = true;
      this.api.taf_post("genre/delete", genre,(reponse: any)=>{
        //when success
        if(reponse.status){
          console.log("Opération effectuée avec succés sur la table genre . Réponse = ",reponse)
          this.get_genre()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table genre  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_genre = false;
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_genre = false;
      })
    }
    openModal_add_genre() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddGenreComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_genre()
        } else {

        }
      })
    }
    openModal_edit_genre(one_genre: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditGenreComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.genre_to_edit = one_genre;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status) {
          this.get_genre()
        } else {

        }
      })
    }
  }
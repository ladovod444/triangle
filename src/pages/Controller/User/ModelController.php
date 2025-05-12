<?php
/*
 *  Copyright 2022.  Baks.dev <admin@baks.dev>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

namespace Pages\Controller\User;

use BaksDev\Core\Controller\AbstractController;
use BaksDev\Core\Form\Search\SearchDTO;
use BaksDev\Core\Form\Search\SearchForm;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class ModelController extends AbstractController
{
    #[Route('/model', name: 'user.model')]
    public function index(Request $request) : Response
    {
        
        // $mod = new ModifyAction('update');
        //        $mod = ModifyAction::UPDATE;
        //        dump($mod->value);
        //
        //
        //        $mod = ModifyAction::from($mod->value);
        //        dump($mod);

        // Поиск по всему сайту
        $allSearch = new SearchDTO($request);
        $allSearchForm = $this->createForm(SearchForm::class, $allSearch, [
            'action' => $this->generateUrl('core:search'),
        ]);

        // 'all_search' => $allSearchForm->createView(),
        
        return $this->render(['all_search' => $allSearchForm->createView(),]);
        
        //        return $this->render('home/index.html.twig', [
        //            'controller_name' => 'HomeController',
        //        ]);
    }

    
}

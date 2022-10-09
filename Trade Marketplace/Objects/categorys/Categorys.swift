//
//  Categorys.swift
//  Trade Marketplace
//
//  Created by William larsen on 16/09/22.
//

import SwiftUI

struct Categorys: View {
    @State var categorybuttontitle: String = ""
    @State var categorybuttoncolor: String = ""
    @State var categorybuttonimage: String = ""

    var body: some View {
        NavigationLink(destination: CategoryView(categoryname: categorybuttontitle, returnable: true)){
                RoundedRectangle(cornerRadius: 11)
                    .frame(width: 129, height: 172)
                    .foregroundColor(.white)
                    .shadow(color:Color("dropshadow25"), radius: 8, x: 0, y: 6)
                    .overlay(
                        VStack{
                            ZStack{
                                RoundedRectangle(cornerRadius: 11)
                                    .frame(width: 92, height: 92)
                                    .foregroundColor(Color(categorybuttoncolor))
                                    
                                Image(categorybuttonimage)
                            }
                            Text(categorybuttontitle)
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundColor(.black)
                            
                        })
        }
    }
}

struct Categorys_Previews: PreviewProvider {
    static var previews: some View {
        Categorys()
    }
}
